with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for idx in range(210, min(240, len(lines))):
    safe_line = lines[idx].strip().encode('ascii', 'ignore').decode('ascii')
    print(f"Line {idx+1:03d}: {safe_line}")
