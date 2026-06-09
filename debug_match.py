with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("Length of content:", len(content))
print("Is '</section>' in content?", "  </section>" in content)
print("Is '<!--  SERVICES  -->' in content?", "  <!--  SERVICES  -->" in content)
print("Count of '  </section>':", content.count("  </section>"))
print("Count of '  <!--  SERVICES  -->':", content.count("  <!--  SERVICES  -->"))

# Let's search around "  <!--  SERVICES  -->"
idx = content.find("  <!--  SERVICES  -->")
if idx != -1:
    before = content[idx-30:idx]
    after = content[idx:idx+50]
    print(f"Match found at index {idx}!")
    print(f"Before: {repr(before)}")
    print(f"After: {repr(after)}")
else:
    print("Not found at all!")
