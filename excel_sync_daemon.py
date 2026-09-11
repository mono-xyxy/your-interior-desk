import time
import sqlite3
import openpyxl
import os
import csv

DB_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\client_designer.db"
EXCEL_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx"
CSV_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.csv"

def auto_fit_columns(ws):
    for col in ws.columns:
        max_len = 0
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        for cell in col:
            val = str(cell.value or '')
            if len(val) > max_len:
                max_len = len(val)
        ws.column_dimensions[col_letter].width = min(max(max_len + 4, 15), 65)

def sync_sql_to_excel():
    if not os.path.exists(DB_PATH):
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()

        # Query all submissions from SQL table
        c.execute("SELECT id, timestamp, role, fullName, email, phone, location, budget, wordCount, description, synced_to_excel FROM submissions ORDER BY timestamp ASC")
        rows = c.fetchall()

        if not rows:
            conn.close()
            return

        # 1. Update CSV (instant fallback, never locked)
        csv_exists = os.path.exists(CSV_PATH)
        with open(CSV_PATH, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['ID', 'Timestamp', 'Role', 'Full Name', 'Email Address', 'Phone', 'Location', 'Budget (INR)', 'Word Count', 'Description'])
            for r in rows:
                writer.writerow([r[0], r[1], r[2].upper(), r[3], r[4], r[5], r[6], r[7], r[8], r[9]])

        # 2. Update Excel Workbook (.xlsx)
        try:
            wb = openpyxl.Workbook()
            
            # Sheet 1: Designers
            ws_designers = wb.active
            ws_designers.title = 'Designers'
            ws_designers.append(['Submission ID', 'Timestamp', 'Full Name', 'Email Address', 'Phone / WhatsApp', 'Working Location in India', 'Working Budget Fee (₹)', 'Word Count', 'Professional Overview & Experience'])

            # Sheet 2: Clients
            ws_clients = wb.create_sheet(title='Clients')
            ws_clients.append(['Submission ID', 'Timestamp', 'Full Name', 'Email Address', 'Phone / WhatsApp', 'Property Location in India', 'Offered Budget (₹)', 'Word Count', 'Detailed Scope of Work & Requirements'])

            # Sheet 3: Master Log
            ws_master = wb.create_sheet(title='All_Submissions')
            ws_master.append(['ID', 'Timestamp', 'Role Type', 'Name', 'Email', 'Phone', 'Location', 'Budget (₹)', 'Word Count', 'Description Summary'])

            for r in rows:
                sub_id, timestamp, role, name, email, phone, location, budget, word_count, desc, _ = r
                if role == 'designer':
                    ws_designers.append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])
                else:
                    ws_clients.append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])

                ws_master.append([sub_id, timestamp, role.upper(), name, email, phone, location, budget, word_count, desc])

            auto_fit_columns(ws_designers)
            auto_fit_columns(ws_clients)
            auto_fit_columns(ws_master)

            wb.save(EXCEL_PATH)

            # Mark all as synced in SQL
            c.execute("UPDATE submissions SET synced_to_excel = 1")
            conn.commit()
            print(f"[✓ Excel 10s Pull] Successfully synced {len(rows)} entries from SQL Table into Excel ({EXCEL_PATH})")

        except PermissionError:
            print(f"[Notice] Excel file is currently open in Microsoft Excel. Saved to SQL Table & CSV. Will retry pulling to Excel in 10 seconds...")

        conn.close()

    except Exception as e:
        print(f"[Error in 10s Sync Loop]: {e}")

if __name__ == "__main__":
    print("=" * 65)
    print("  YOUR INTERIOR DESK - 10-SECOND SQL TO EXCEL PULL DAEMON")
    print("  SQL Database:  ", DB_PATH)
    print("  Target Excel:  ", EXCEL_PATH)
    print("  Interval:       Every 10 Seconds")
    print("=" * 65)
    print("[*] Running continuous 10-second pull loop... Press Ctrl+C to stop.\n")

    while True:
        sync_sql_to_excel()
        time.sleep(10)
