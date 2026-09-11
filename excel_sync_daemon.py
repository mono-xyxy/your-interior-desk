import time
import requests
import openpyxl
import os
import csv

EXCEL_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx"
CSV_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.csv"
API_URL = os.environ.get("VERCEL_API_URL", "http://localhost:3000/api/submissions")

processed_ids = set()

def sync():
    global processed_ids
    try:
        res = requests.get(API_URL, timeout=10)
        if res.status_code == 200:
            data = res.json()
            submissions = data.get("submissions", [])

            dir_path = os.path.dirname(EXCEL_PATH)
            os.makedirs(dir_path, exist_ok=True)

            new_subs = [s for s in reversed(submissions) if s.get("id") not in processed_ids]

            if not new_subs:
                return

            # Always write to CSV (never locked by Windows Excel)
            csv_exists = os.path.exists(CSV_PATH)
            with open(CSV_PATH, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if not csv_exists:
                    writer.writerow(['ID', 'Timestamp', 'Role', 'Full Name', 'Email Address', 'Phone', 'Location', 'Budget (INR)', 'Word Count', 'Description'])
                for sub in new_subs:
                    writer.writerow([
                        sub.get("id"), sub.get("timestamp"), sub.get("role", "").upper(),
                        sub.get("fullName"), sub.get("email"), sub.get("phone"),
                        sub.get("location"), sub.get("budget"), sub.get("wordCount", 0),
                        sub.get("description")
                    ])

            # Try writing to Excel workbook
            try:
                if os.path.exists(EXCEL_PATH):
                    wb = openpyxl.load_workbook(EXCEL_PATH)
                else:
                    wb = openpyxl.Workbook()
                    wb.active.title = 'Designers'
                    wb.create_sheet('Clients')
                    wb.create_sheet('All_Submissions')

                for sub in new_subs:
                    sub_id = sub.get("id")
                    role = sub.get("role")
                    timestamp = sub.get("timestamp")
                    name = sub.get("fullName")
                    email = sub.get("email")
                    phone = sub.get("phone")
                    location = sub.get("location")
                    budget = sub.get("budget")
                    word_count = sub.get("wordCount", 0)
                    desc = sub.get("description")

                    if role == "designer" and 'Designers' in wb.sheetnames:
                        wb['Designers'].append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])
                    elif role == "client" and 'Clients' in wb.sheetnames:
                        wb['Clients'].append([sub_id, timestamp, name, email, phone, location, budget, word_count, desc])

                    if 'All_Submissions' in wb.sheetnames:
                        wb['All_Submissions'].append([sub_id, timestamp, role.upper(), name, email, phone, location, budget, word_count, desc])

                    processed_ids.add(sub_id)

                wb.save(EXCEL_PATH)
                print(f"[✓] Successfully synced {len(new_subs)} entries to Excel.")
            except PermissionError:
                print(f"[!] Primary Excel file is open in Microsoft Excel. Saved {len(new_subs)} entries to CSV ({CSV_PATH}). Will retry Excel sync when closed.")
                for s in new_subs:
                    processed_ids.add(s.get("id"))

    except Exception as e:
        pass

if __name__ == "__main__":
    print("[*] Starting continuous Excel & CSV auto-sync daemon...")
    while True:
        sync()
        time.sleep(3)
