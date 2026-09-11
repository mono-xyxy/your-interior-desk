import time
import requests
import sqlite3
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import os
import csv

DB_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\client_designer.db"
EXCEL_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx"
CSV_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.csv"

# Cloud Vercel Endpoint or Local Server Endpoint
VERCEL_API = os.environ.get("VERCEL_API_URL", "https://your-interior-desk.vercel.app/api/submissions")
LOCAL_API = "http://localhost:3000/api/submissions"

processed_ids = set()

# Excel Beautification Styles
header_fill = PatternFill(start_color='101B2E', end_color='101B2E', fill_type='solid')
header_font = Font(name='Segoe UI', size=11, bold=True, color='F8FAFC')

row_fill_even = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
row_fill_odd = PatternFill(start_color='F8FAFC', end_color='F8FAFC', fill_type='solid')

thin_border = Border(
    left=Side(style='thin', color='E2E8F0'),
    right=Side(style='thin', color='E2E8F0'),
    top=Side(style='thin', color='E2E8F0'),
    bottom=Side(style='thin', color='E2E8F0')
)

align_center = Alignment(horizontal='center', vertical='center')
align_left = Alignment(horizontal='left', vertical='center')

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if len(val) > max_len:
                max_len = len(val)
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 16), 65)

def apply_beautification(ws):
    # Header styling
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center

    # Data row styling
    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        fill = row_fill_even if row_idx % 2 == 0 else row_fill_odd
        for cell in row:
            cell.fill = fill
            cell.border = thin_border
            if cell.column in [1, 2, 3, 5, 8]:  # ID, Timestamp, Role, Phone, Word Count
                cell.alignment = align_center
            else:
                cell.alignment = align_left

    auto_fit_columns(ws)

def fetch_latest_submissions():
    # Try cloud Vercel API first
    for endpoint in [VERCEL_API, LOCAL_API]:
        try:
            res = requests.get(endpoint, timeout=3)
            if res.status_code == 200:
                data = res.json()
                subs = data.get("submissions", [])
                if subs:
                    return subs
        except Exception:
            pass

    # Fallback to local SQLite Database
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            c.execute("SELECT id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount FROM submissions ORDER BY timestamp ASC")
            rows = c.fetchall()
            conn.close()
            return [
                {
                    "id": r[0], "timestamp": r[1], "role": r[2], "fullName": r[3],
                    "email": r[4], "phone": r[5], "location": r[6], "budget": r[7],
                    "socialHandles": r[8], "description": r[9], "wordCount": r[10]
                } for r in rows
            ]
        except Exception:
            pass

    return []

def save_to_sqlite(subs):
    if not os.path.exists(os.path.dirname(DB_PATH)):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
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
                synced_to_excel INTEGER DEFAULT 0
            )
        """)
        for s in subs:
            c.execute("""
                INSERT OR REPLACE INTO submissions 
                (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, synced_to_excel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                s.get("id"), s.get("timestamp"), s.get("role"), s.get("fullName"),
                s.get("email"), s.get("phone"), s.get("location"), s.get("budget"),
                s.get("socialHandles", ""), s.get("description"), s.get("wordCount", 0)
            ))
        conn.commit()
        conn.close()
    except Exception as e:
        pass

def sync_1second():
    subs = fetch_latest_submissions()
    if not subs:
        return

    # 1. Update SQL Database
    save_to_sqlite(subs)

    dir_path = os.path.dirname(EXCEL_PATH)
    os.makedirs(dir_path, exist_ok=True)

    # 2. Update CSV (Instant lock-free logging)
    try:
        with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['ID', 'Timestamp', 'Role', 'Full Name', 'Email Address', 'Phone', 'Location', 'Budget (INR)', 'Social Handles', 'Word Count', 'Description'])
            for s in reversed(subs):
                writer.writerow([
                    s.get("id"), s.get("timestamp"), s.get("role", "").upper(),
                    s.get("fullName"), s.get("email"), s.get("phone"),
                    s.get("location"), s.get("budget"), s.get("socialHandles", ""),
                    s.get("wordCount", 0), s.get("description")
                ])
    except Exception as e:
        pass

    # 3. Update Excel Workbook (.xlsx)
    try:
        wb = openpyxl.Workbook()

        # Sheet 1: Designers
        ws_designers = wb.active
        ws_designers.title = 'Designers'
        ws_designers.append(['Submission ID', 'Timestamp', 'Full Name', 'Email Address', 'Phone / WhatsApp', 'Working Location in India', 'Working Budget Fee (₹)', 'Word Count', 'Social Handles', 'Professional Overview & Experience'])

        # Sheet 2: Clients
        ws_clients = wb.create_sheet(title='Clients')
        ws_clients.append(['Submission ID', 'Timestamp', 'Full Name', 'Email Address', 'Phone / WhatsApp', 'Property Location in India', 'Offered Budget (₹)', 'Word Count', 'Detailed Scope of Work & Requirements'])

        # Sheet 3: Master Log
        ws_master = wb.create_sheet(title='All_Submissions')
        ws_master.append(['ID', 'Timestamp', 'Role Type', 'Name', 'Email', 'Phone', 'Location', 'Budget (₹)', 'Word Count', 'Description Summary'])

        for s in reversed(subs):
            sub_id = s.get("id")
            timestamp = s.get("timestamp")
            role = s.get("role", "")
            name = s.get("fullName")
            email = s.get("email")
            phone = s.get("phone")
            location = s.get("location")
            budget = s.get("budget")
            social = s.get("socialHandles", "")
            word_count = s.get("wordCount", 0)
            desc = s.get("description")

            if role == 'designer':
                ws_designers.append([sub_id, timestamp, name, email, phone, location, budget, word_count, social, desc])
            else:
                ws_clients.append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])

            ws_master.append([sub_id, timestamp, role.upper(), name, email, phone, location, budget, word_count, desc])

        apply_beautification(ws_designers)
        apply_beautification(ws_clients)
        apply_beautification(ws_master)

        wb.save(EXCEL_PATH)
        print(f"[✓ 1s Real-Time Sync] Updated Excel Workbook & SQL Database with {len(subs)} total submissions.")

    except PermissionError:
        print(f"[Notice] Excel file is currently open in Microsoft Excel. Saved to SQL & CSV. Retrying 1s update...")

if __name__ == "__main__":
    print("=" * 65)
    print("  YOUR INTERIOR DESK - 1-SECOND REAL-TIME EXCEL AUTO-SYNC DAEMON")
    print("  Vercel Cloud API:", VERCEL_API)
    print("  Target SQLite DB:", DB_PATH)
    print("  Target Excel:    ", EXCEL_PATH)
    print("  Target CSV:      ", CSV_PATH)
    print("  Interval:         EVERY 1 SECOND")
    print("=" * 65)
    print("[*] Running 1-second real-time sync loop... Press Ctrl+C to stop.\n")

    while True:
        sync_1second()
        time.sleep(1)

