import time
import requests
import sqlite3
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import os
import csv
import json
import subprocess

DESKTOP_ROOT = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk"
SUBMISSIONS_DIR = os.path.join(DESKTOP_ROOT, "Submissions")
SIGNATURES_DIR = os.path.join(SUBMISSIONS_DIR, "Signatures")
DB_PATH = os.path.join(DESKTOP_ROOT, "Client_Designer_DB", "client_designer.db")
EXCEL_PATH = os.path.join(DESKTOP_ROOT, "Client_Designer_DB", "Client_Designer.xlsx")
ROOT_EXCEL_PATH = os.path.join(DESKTOP_ROOT, "Client_Designer.xlsx")
CSV_PATH = os.path.join(DESKTOP_ROOT, "Client_Designer_DB", "Client_Designer.csv")

# Ensure all target folders exist
for d in [DESKTOP_ROOT, SUBMISSIONS_DIR, SIGNATURES_DIR, os.path.dirname(DB_PATH)]:
    os.makedirs(d, exist_ok=True)

# Cloud Vercel Endpoints & Local Endpoints
VERCEL_API = os.environ.get("VERCEL_API_URL", "https://your-interior-desk.vercel.app/api/submissions")
VERCEL_REVIEWS_API = os.environ.get("VERCEL_REVIEWS_API_URL", "https://your-interior-desk.vercel.app/api/reviews")
GITHUB_SUBS_API = "https://raw.githubusercontent.com/mono-xyxy/your-interior-desk/main/data/submissions.json"
LOCAL_API = "http://localhost:3000/api/submissions"
LOCAL_REVIEWS_API = "http://localhost:3000/api/reviews"

# ─── Excel Beautification Styles (Steel Navy Premium Design) ─────────────────────
header_fill = PatternFill(start_color='101B2E', end_color='101B2E', fill_type='solid')
header_font = Font(name='Calibri', size=11, bold=True, color='F8FAFC')

row_fill_even = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
row_fill_odd = PatternFill(start_color='F8FAFC', end_color='F8FAFC', fill_type='solid')

# Signed Status Highlight (Emerald Green Pill Style)
signed_fill = PatternFill(start_color='E8F5E9', end_color='E8F5E9', fill_type='solid')
signed_font = Font(name='Calibri', size=11, bold=True, color='1B5E20')

thin_border = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)

align_center = Alignment(horizontal='center', vertical='center')
align_left = Alignment(horizontal='left', vertical='center')
align_wrap = Alignment(horizontal='left', vertical='top', wrap_text=True)

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if len(val) > max_len:
                max_len = len(val)
        ws.column_dimensions[col_letter].width = min(max(max_len + 5, 16), 65)

def apply_beautification(ws):
    ws.row_dimensions[1].height = 28
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center

    max_cols = ws.max_column
    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        fill = row_fill_even if row_idx % 2 == 0 else row_fill_odd
        ws.row_dimensions[row_idx].height = 24
        for cell in row:
            cell.fill = fill
            cell.border = thin_border
            cell.font = Font(name='Calibri', size=11, color='0F172A')

            # Highlight Signed Status
            if str(cell.value or '').lower() in ['signed', '✓ signed']:
                cell.fill = signed_fill
                cell.font = signed_font
                cell.alignment = align_center
            elif cell.column in [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]:
                cell.alignment = align_center
            elif cell.column in [max_cols]:
                cell.alignment = align_wrap
            else:
                cell.alignment = align_left

    auto_fit_columns(ws)

def fetch_cloud_submissions():
    merged = {}
    for endpoint in [VERCEL_API, GITHUB_SUBS_API, LOCAL_API]:
        try:
            res = requests.get(endpoint, timeout=4)
            if res.status_code == 200:
                data = res.json()
                items = data if isinstance(data, list) else data.get("submissions", [])
                for item in items:
                    if isinstance(item, dict) and item.get("id"):
                        merged[item["id"]] = item
        except Exception:
            pass
    return list(merged.values())

def fetch_cloud_reviews():
    merged = {}
    for endpoint in [VERCEL_REVIEWS_API, LOCAL_REVIEWS_API]:
        try:
            res = requests.get(endpoint, timeout=4)
            if res.status_code == 200:
                data = res.json()
                items = data if isinstance(data, list) else data.get("reviews", [])
                for item in items:
                    if isinstance(item, dict) and item.get("id"):
                        merged[item["id"]] = item
        except Exception:
            pass
    return list(merged.values())

def generate_missing_pdfs(subs):
    """Generates signed PDFs in Submissions directory for any cloud submissions that don't have local PDFs"""
    missing = []
    for s in subs:
        clean_name = (s.get("signatureFullName") or s.get("fullName") or "User").replace(" ", "_")
        pdf_name = s.get("pdfFileName") or s.get("pdf_file_name") or f"{clean_name}_2026-09-12.pdf"
        target_pdf = os.path.join(SUBMISSIONS_DIR, pdf_name)
        if not os.path.exists(target_pdf):
            missing.append(s)

    if missing:
        helper_path = os.path.join(os.path.dirname(__file__), "sync_pdf_helper.mjs")
        temp_json = os.path.join(os.path.dirname(__file__), "temp_missing.json")
        try:
            with open(temp_json, "w", encoding="utf-8") as f:
                json.dump(missing, f)
            subprocess.run(["node", helper_path, temp_json], capture_output=True, timeout=30)
        except Exception as e:
            print("PDF generation helper notice:", e)
        finally:
            if os.path.exists(temp_json):
                try: os.remove(temp_json)
                except: pass

def get_all_db_submissions():
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH, timeout=10.0)
            c = conn.cursor()
            c.execute("""
                SELECT id, timestamp, role, fullName, email, phone, location, budget, 
                       socialHandles, description, wordCount, signed_status, signatureFullName,
                       pdf_file_name, pdf_path
                FROM submissions ORDER BY timestamp ASC
            """)
            rows = c.fetchall()
            conn.close()
            return [
                {
                    "id": r[0], "timestamp": r[1], "role": r[2], "fullName": r[3],
                    "email": r[4], "phone": r[5], "location": r[6], "budget": r[7],
                    "socialHandles": r[8], "description": r[9], "wordCount": r[10],
                    "signed_status": r[11] or "signed", "signatureFullName": r[12] or "",
                    "pdf_file_name": (r[13] if len(r) > 13 else "") or "",
                    "pdf_path": (r[14] if len(r) > 14 else "") or ""
                } for r in rows
            ]
        except Exception:
            pass
    return []

def get_all_db_reviews():
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH, timeout=10.0)
            c = conn.cursor()
            c.execute("SELECT id, timestamp, name, email, role, ratingScore, ratingKeyword, emoji, reviewText, matchedKeywords, wordCount FROM reviews ORDER BY timestamp ASC")
            rows = c.fetchall()
            conn.close()
            return [
                {
                    "id": r[0], "timestamp": r[1], "name": r[2], "email": r[3],
                    "role": r[4], "ratingScore": r[5], "ratingKeyword": r[6],
                    "emoji": r[7], "reviewText": r[8], "matchedKeywords": r[9], "wordCount": r[10]
                } for r in rows
            ]
        except Exception:
            pass
    return []

def save_to_sqlite(subs, reviews):
    try:
        conn = sqlite3.connect(DB_PATH, timeout=10.0)
        c = conn.cursor()
        c.execute("PRAGMA busy_timeout = 10000")
        c.execute("""
            CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY,
                timestamp TEXT,
                role TEXT,
                fullName TEXT,
                email TEXT,
                phone TEXT,
                location TEXT,
                budget TEXT,
                socialHandles TEXT,
                description TEXT,
                wordCount INTEGER,
                signed_status TEXT DEFAULT 'signed',
                signatureFullName TEXT,
                signatureFileName TEXT,
                signatureFilePath TEXT,
                termsAccepted INTEGER DEFAULT 1,
                pdf_file_name TEXT,
                pdf_path TEXT,
                synced_to_excel INTEGER DEFAULT 0
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                timestamp TEXT,
                name TEXT,
                email TEXT,
                role TEXT,
                ratingScore INTEGER,
                ratingKeyword TEXT,
                emoji TEXT,
                reviewText TEXT,
                matchedKeywords TEXT,
                wordCount INTEGER
            )
        """)

        for s in subs:
            role_str = "Designer" if s.get("role", "").lower() == "designer" else "Client"
            clean_name = (s.get("signatureFullName") or s.get("fullName") or "User").replace(" ", "_")
            ts_str = (s.get("timestamp") or "").split(",")[0].strip().replace("/", "-")
            default_pdf = f"{clean_name}_{ts_str}.pdf"
            pdf_name = s.get("pdfFileName") or s.get("pdf_file_name") or default_pdf
            pdf_path = os.path.join(SUBMISSIONS_DIR, pdf_name)

            c.execute("""
                INSERT OR REPLACE INTO submissions 
                (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, signed_status, signatureFullName, pdf_file_name, pdf_path, synced_to_excel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                s.get("id"), s.get("timestamp"), role_str, s.get("fullName"),
                s.get("email"), s.get("phone"), s.get("location"), s.get("budget"),
                s.get("socialHandles", ""), s.get("description"), s.get("wordCount", 0),
                s.get("signedStatus") or s.get("signed_status") or "signed",
                s.get("signatureFullName", ""),
                pdf_name,
                pdf_path
            ))

        for r in reviews:
            c.execute("""
                INSERT OR REPLACE INTO reviews 
                (id, timestamp, name, email, role, ratingScore, ratingKeyword, emoji, reviewText, matchedKeywords, wordCount)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r.get("id"), r.get("timestamp"), r.get("name"), r.get("email"),
                r.get("role"), r.get("ratingScore", 5), r.get("ratingKeyword", "Good"),
                r.get("emoji", "😊"), r.get("reviewText"), r.get("matchedKeywords", ""), r.get("wordCount", 0)
            ))

        conn.commit()
        conn.close()
    except Exception as err:
        print("save_to_sqlite error:", err)

def sync_1second():
    # 1. Fetch Cloud API & GitHub submissions & reviews
    cloud_subs = fetch_cloud_submissions()
    cloud_revs = fetch_cloud_reviews()

    # 2. Auto-generate signed PDFs in Submissions directory for any cloud submissions
    if cloud_subs:
        generate_missing_pdfs(cloud_subs)

    # 3. Save Cloud items into local SQLite DB
    if cloud_subs or cloud_revs:
        save_to_sqlite(cloud_subs, cloud_revs)

    # 4. Read ALL cumulative records from SQLite DB
    subs = get_all_db_submissions()
    reviews = get_all_db_reviews()

    if not subs and not reviews:
        return

    # 5. Update CSV Log Files
    try:
        with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Submission Id', 'Timestamp', 'Role', 'Full Name', 'Email Address', 
                'Phone Number', 'Location', 'Budget Range (₹)', 'Social Handles', 
                'Signed Status', 'Signature Name', 'PDF File Name', 'PDF Storage Path',
                'Word Count', 'Project Description'
            ])
            for s in reversed(subs):
                role_title = "Designer" if s.get("role", "").lower() == "designer" else "Client"
                clean_name = (s.get("signatureFullName") or s.get("fullName") or "User").replace(" ", "_")
                ts_str = (s.get("timestamp") or "").split(",")[0].strip().replace("/", "-")
                default_pdf = f"{clean_name}_{ts_str}.pdf"
                pdf_name = s.get("pdf_file_name") or s.get("pdfFileName") or default_pdf
                pdf_path = os.path.join(SUBMISSIONS_DIR, pdf_name)

                writer.writerow([
                    s.get("id"), s.get("timestamp"), role_title,
                    s.get("fullName"), s.get("email"), s.get("phone"),
                    s.get("location"), s.get("budget"), s.get("socialHandles", ""),
                    s.get("signed_status", "signed"), s.get("signatureFullName", ""),
                    pdf_name, pdf_path,
                    s.get("wordCount", 0), s.get("description")
                ])
    except Exception:
        pass

    # 6. Update Excel Workbook (.xlsx) with BEAUTIFIED STYLING
    try:
        wb = openpyxl.Workbook()

        # Sheet 1: Designers
        ws_designers = wb.active
        ws_designers.title = 'Designers'
        ws_designers.append([
            'Submission Id', 'Timestamp', 'Full Name', 'Email Address', 'Phone Number', 
            'Working Location', 'Budget Fee (₹)', 'Signed Status', 'Signature Name', 
            'PDF File Name', 'PDF Storage Path', 'Word Count', 'Social Handles', 'Professional Overview'
        ])

        # Sheet 2: Clients
        ws_clients = wb.create_sheet(title='Clients')
        ws_clients.append([
            'Submission Id', 'Timestamp', 'Full Name', 'Email Address', 'Phone Number', 
            'Property Location', 'Offered Budget (₹)', 'Signed Status', 'Signature Name', 
            'PDF File Name', 'PDF Storage Path', 'Word Count', 'Project Scope'
        ])

        # Sheet 3: Master Log
        ws_master = wb.create_sheet(title='All Submissions')
        ws_master.append([
            'Submission Id', 'Timestamp', 'Role Type', 'Full Name', 'Email Address', 
            'Phone Number', 'Location', 'Budget Range (₹)', 'Signed Status', 'Signature Name', 
            'PDF File Name', 'PDF Storage Path', 'Word Count', 'Project Details'
        ])

        # Sheet 4: Reviews & Feedback
        ws_reviews = wb.create_sheet(title='Reviews')
        ws_reviews.append(['Review Id', 'Timestamp', 'Author Name', 'Email Address', 'Role', 'Sentiment Keyword', 'Emoji', 'Rating Score', 'Matched Keywords', 'Review Text'])

        for s in reversed(subs):
            sub_id = s.get("id")
            timestamp = s.get("timestamp")
            raw_role = s.get("role", "")
            role_title = "Designer" if raw_role.lower() == "designer" else "Client"
            name = s.get("fullName")
            email = s.get("email")
            phone = s.get("phone")
            location = s.get("location")
            budget = s.get("budget")
            social = s.get("socialHandles", "")
            signed_status = s.get("signed_status", "signed")
            sig_name = s.get("signatureFullName", "")
            clean_name = (sig_name or name or "User").replace(" ", "_")
            ts_str = (timestamp or "").split(",")[0].strip().replace("/", "-")
            default_pdf = f"{clean_name}_{ts_str}.pdf"
            pdf_name = s.get("pdf_file_name") or s.get("pdfFileName") or default_pdf
            pdf_path = os.path.join(SUBMISSIONS_DIR, pdf_name)
            word_count = s.get("wordCount", 0)
            desc = s.get("description")

            if role_title == 'Designer':
                ws_designers.append([sub_id, timestamp, name, email, phone, location, budget, signed_status, sig_name, pdf_name, pdf_path, word_count, social, desc])
            else:
                ws_clients.append([sub_id, timestamp, name, email, phone, location, budget, signed_status, sig_name, pdf_name, pdf_path, word_count, desc])

            ws_master.append([sub_id, timestamp, role_title, name, email, phone, location, budget, signed_status, sig_name, pdf_name, pdf_path, word_count, desc])

        for r in reversed(reviews):
            ws_reviews.append([
                r.get("id"), r.get("timestamp"), r.get("name"), r.get("email"),
                r.get("role"), r.get("ratingKeyword"), r.get("emoji"),
                r.get("ratingScore"), r.get("matchedKeywords"), r.get("reviewText")
            ])

        apply_beautification(ws_designers)
        apply_beautification(ws_clients)
        apply_beautification(ws_master)
        apply_beautification(ws_reviews)

        # Save to both target locations
        for out_path in [EXCEL_PATH, ROOT_EXCEL_PATH]:
            try:
                wb.save(out_path)
            except PermissionError:
                fallback = out_path.replace('.xlsx', '_Latest.xlsx')
                try: wb.save(fallback)
                except: pass

        print(f"[OK Real-Time Sync] Synced {len(subs)} submissions & {len(reviews)} reviews with Beautified Excel styling.")

    except PermissionError:
        print("[Notice] Excel file is currently open in Microsoft Excel. Saved to SQLite & CSV. Will update Excel when closed.")
    except Exception as e:
        print("Excel save error:", e)

if __name__ == "__main__":
    print("=" * 65)
    print("  YOUR INTERIOR DESK - REAL-TIME EXCEL BEAUTIFIER & PDF AUTO-SYNC")
    print("  Submissions PDF Directory: ", SUBMISSIONS_DIR)
    print("  Target Excel File:          ", EXCEL_PATH)
    print("  Target SQLite DB:           ", DB_PATH)
    print("=" * 65)
    print("[*] Running continuous sync loop... Press Ctrl+C to stop.\n")

    while True:
        sync_1second()
        time.sleep(2)
