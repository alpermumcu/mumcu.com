import os
import re

# Paths
PAGES_DIR = r'd:\mumcu.com\src\content\pages'
BLOG_DIR = r'd:\mumcu.com\src\content\blog'

# Regex for [Text](/path/?p=ID)
LINK_REGEX = re.compile(r'\[(.*?)\]\(/.*?\?p=(\d+).*?\)')

def build_blog_mapping():
    mapping = {} # Title (lower/clean) -> Slug
    if not os.path.exists(BLOG_DIR):
        print(f"Error: BLOG_DIR {BLOG_DIR} not found.")
        return mapping
        
    for filename in os.listdir(BLOG_DIR):
        if filename.endswith('.md'):
            with open(os.path.join(BLOG_DIR, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                # Extract title from frontmatter
                title_match = re.search(r'^title:\s*(.*)$', content, re.MULTILINE)
                if title_match:
                    title = title_match.group(1).strip().strip('"').strip("'").lower()
                    slug = filename[:-3] # Remove .md
                    mapping[title] = slug
    return mapping

def fix_links():
    blog_map = build_blog_mapping()
    print(f"Built mapping for {len(blog_map)} blog posts.")
    
    if not os.path.exists(PAGES_DIR):
        print(f"Error: PAGES_DIR {PAGES_DIR} not found.")
        return
        
    for filename in os.listdir(PAGES_DIR):
        if filename.endswith('.md'):
            file_path = os.path.join(PAGES_DIR, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            # Correcting the pattern to be more flexible with categories
            # Pattern: [Link Text](/category-name/?p=123) or [Link Text](/?p=123)
            matches = re.findall(r'\[(.*?)\]\((/.*?/?\?p=(\d+).*?)\)', content)
            
            for text, full_link, wp_id in matches:
                clean_text = text.lower().strip()
                # Some link names are too short or dynamic, skip if tiny
                if len(clean_text) < 3: continue
                
                found = False
                # Exact match
                if clean_text in blog_map:
                    new_slug = blog_map[clean_text]
                    found = True
                else:
                    # Fuzzy match
                    for title, slug in blog_map.items():
                        if clean_text == title or (len(clean_text) > 5 and clean_text in title) or (len(title) > 5 and title in clean_text):
                            new_slug = slug
                            found = True
                            break
                            
                if found:
                    new_link = f'[{text}](/blog/{new_slug}/)'
                    # Replace only this specific occurrence
                    old_full = f'[{text}]({full_link})'
                    new_content = new_content.replace(old_full, new_link)
                    print(f"Fixed: [{text}] -> /blog/{new_slug}/")
                else:
                    print(f"Unmatched in {filename}: [{text}] (ID: {wp_id})")
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

if __name__ == "__main__":
    fix_links()
