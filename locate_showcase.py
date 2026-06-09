with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for idx, line in enumerate(lines, 1):
    if 'websites-showcase' in line:
        print(f"Match found at line {idx}: {line.strip()}")
        # print surrounding 5 lines
        start = max(0, idx - 4)
        end = min(len(lines), idx + 5)
        for j in range(start, end):
            safe_line = lines[j].strip().encode('ascii', 'ignore').decode('ascii')
            print(f"  Line {j+1:03d}: {safe_line}")
