import sqlite3
import json
import sys
import os

DB_FILE = 'database.sqlite'

def check_sqlite_duplicates():
    if not os.path.exists(DB_FILE):
        print(f"SQLite DB {DB_FILE} not found.")
        return
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT value FROM store WHERE key='products'")
        row = cursor.fetchone()
        if not row:
            print("No products found in DB.")
            return
            
        products = json.loads(row[0])
        barcode_map = {}
        
        for p in products:
            barcode = p.get('barcode', '').strip()
            if barcode:
                if barcode not in barcode_map:
                    barcode_map[barcode] = []
                barcode_map[barcode].append(p)
                
        has_dup = False
        print("--- Duplicate Barcode Report ---")
        for barcode, items in barcode_map.items():
            if len(items) > 1:
                has_dup = True
                print(f"\nBarcode: {barcode} is duplicated in {len(items)} products:")
                for item in items:
                    print(f" - [ID: {item.get('id')}] {item.get('name')}")
                    
        if not has_dup:
            print("No duplicate barcodes found.")
            
    except Exception as e:
        print("Error checking duplicates:", e)
    finally:
        conn.close()

if __name__ == "__main__":
    check_sqlite_duplicates()
