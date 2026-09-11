import time
import requests
import openpyxl
import os

EXCEL_PATH = r"C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Client_Designer_DB\Client_Designer.xlsx"
# Update this URL once deployed on Vercel (e.g. https://your-interior-desk.vercel.app/api/submissions)
# Default polls local dev server or configured cloud URL
API_URL = os.environ.get("VERCEL_API_URL", "http://localhost:3000/api/submissions")

print("=" * 65)
print("  YOURINTERIORDESK - EXCEL AUTO-SYNC DAEMON")
print("  Target Spreadsheet:", EXCEL_PATH)
print("  Polling Endpoint:  ", API_URL)
print("=" * 65)

processed_ids = set()

def sync():
    global processed_ids
    try:
        res = requests.get(API_URL, timeout=10)
        if res.status_code == 200:
            data = res.json()
            submissions = data.get("submissions", [])

            if not os.path.exists(EXCEL_PATH):
                print(f"[-] Excel file does not exist at {EXCEL_PATH}. Initializing...")

            wb = openpyxl.load_workbook(EXCEL_PATH)
            new_count = 0

            for sub in reversed(submissions):
                sub_id = sub.get("id")
                if sub_id in processed_ids:
                    continue

                role = sub.get("role")
                timestamp = sub.get("timestamp")
                name = sub.get("fullName")
                email = sub.get("email")
                phone = sub.get("phone")
                location = sub.get("location")
                budget = sub.get("budget")

                if role == "designer":
                    ws = wb["Designers"]
                    ws.append([
                        sub_id, timestamp, name, email, phone,
                        location, budget, sub.get("experience", ""),
                        sub.get("specializations", ""), sub.get("portfolioLink", ""),
                        sub.get("additionalNotes", "")
                    ])
                else:
                    ws = wb["Clients"]
                    ws.append([
                        sub_id, timestamp, name, email, phone,
                        location, budget, sub.get("propertyType", ""),
                        sub.get("scopeOfWork", ""), sub.get("preferredStyle", ""),
                        sub.get("timeline", "")
                    ])

                # Update Master
                ws_master = wb["All_Submissions"]
                details = f"{sub.get('experience', '')} | {sub.get('specializations', '')}" if role == 'designer' else f"{sub.get('propertyType', '')} | {sub.get('scopeOfWork', '')}"
                ws_master.append([
                    sub_id, timestamp, role.upper(), name, email, phone, location, budget, details
                ])

                processed_ids.add(sub_id)
                new_count += 1
                print(f"[+] Synced {role.upper()} submission ({sub_id}): {name} - {email}")

            if new_count > 0:
                wb.save(EXCEL_PATH)
                print(f"[✓] Successfully saved {new_count} new entries to Excel.")

    except Exception as e:
        print(f"[!] Sync polling error (server starting up...): {e}")

if __name__ == "__main__":
    print("[*] Starting continuous auto-sync daemon (Press Ctrl+C to stop)...")
    while True:
        sync()
        time.sleep(5)
