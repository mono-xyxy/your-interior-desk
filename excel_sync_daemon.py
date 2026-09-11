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

# Excel Beautification Styles (Steel Navy Header & Clean Typography)
header_fill = PatternFill(start_color='101B2E', end_color='101B2E', fill_type='solid')
header_font = Font(name='Calibri', size=11, bold=True, color='F8FAFC')

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
align_wrap = Alignment(horizontal='left', vertical='top', wrap_text=True)

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if len(val) > max_len:
                max_len = len(val)
        # Ensure generous column width so headers never get truncated or overlap
        ws.column_dimensions[col_letter].width = min(max(max_len + 6, 22), 70)

def apply_beautification(ws):
    # Header styling
    ws.row_dimensions[1].height = 26
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center

    # Data row styling
    for row_idx, row in enumerate(ws.iter_rows(min_row=2), start=2):
        fill = row_fill_even if row_idx % 2 == 0 else row_fill_odd
        ws.row_dimensions[row_idx].height = 24
        for cell in row:
            cell.fill = fill
            cell.border = thin_border
            cell.font = Font(name='Calibri', size=11, color='0F172A')
            
            # Align center for IDs, Timestamps, Roles, Phones, Word Counts
            if cell.column in [1, 2, 3, 5, 8]:
                cell.alignment = align_center
            elif cell.column in [9, 10]:  # Social handles and long descriptions
                cell.alignment = align_wrap
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
            role_str = "Designer" if s.get("role", "").lower() == "designer" else "Client"
            c.execute("""
                INSERT OR REPLACE INTO submissions 
                (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, synced_to_excel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                s.get("id"), s.get("timestamp"), role_str, s.get("fullName"),
                s.get("email"), s.get("phone"), s.get("location"), s.get("budget"),
                s.get("socialHandles", ""), s.get("description"), s.get("wordCount", 0)
            ))
        conn.commit()
        conn.close()
    except Exception:
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
            writer.writerow(['Submission Id', 'Timestamp', 'Role', 'Full Name', 'Email Address', 'Phone Number', 'Location', 'Budget Range (₹)', 'Social Handles', 'Word Count', 'Project Description'])
            for s in reversed(subs):
                role_title = "Designer" if s.get("role", "").lower() == "designer" else "Client"
                writer.writerow([
                    s.get("id"), s.get("timestamp"), role_title,
                    s.get("fullName"), s.get("email"), s.get("phone"),
                    s.get("location"), s.get("budget"), s.get("socialHandles", ""),
                    s.get("wordCount", 0), s.get("description")
                ])
    except Exception:
        pass

    # 3. Update Excel Workbook (.xlsx)
    try:
        wb = openpyxl.Workbook()

        # Sheet 1: Designers
        ws_designers = wb.active
        ws_designers.title = 'Designers'
        ws_designers.append(['Submission Id', 'Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'Working Location', 'Budget Fee (₹)', 'Word Count', 'Social Handles', 'Professional Overview'])

        # Sheet 2: Clients
        ws_clients = wb.create_sheet(title='Clients')
        ws_clients.append(['Submission Id', 'Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'Property Location', 'Offered Budget (₹)', 'Word Count', 'Project Scope'])

        # Sheet 3: Master Log
        ws_master = wb.create_sheet(title='All Submissions')
        ws_master.append(['Submission Id', 'Timestamp', 'Role Type', 'Full Name', 'Email Address', 'Phone Number', 'Location', 'Budget Range (₹)', 'Word Count', 'Project Details'])

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
            word_count = s.get("wordCount", 0)
            desc = s.get("description")

            if role_title == 'Designer':
                ws_designers.append([sub_id, timestamp, name, email, phone, location, budget, word_count, social, desc])
            else:
                ws_clients.append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])

            ws_master.append([sub_id, timestamp, role_title, name, email, phone, location, budget, word_count, desc])

        apply_beautification(ws_designers)
        apply_beautification(ws_clients)
        apply_beautification(ws_master)

        wb.save(EXCEL_PATH)
        print(f"[✓ 1s Auto-Sync] Excel & SQLite DB synchronized cleanly with {len(subs)} entries.")

    except PermissionError:
        print(f"[Notice] Excel file is open in Microsoft Excel. Saved to SQLite & CSV. Auto-updating Excel when closed...")

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


