#!/usr/bin/env python3
"""
Check JavaScript syntax for template literals and brackets
"""

import sys

def check_syntax(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for unclosed template literals
    in_template = False
    brace_count = 0
    paren_count = 0
    bracket_count = 0
    
    i = 0
    while i < len(content):
        char = content[i]
        
        # Check for backtick (template literal)
        if char == '`' and (i == 0 or content[i-1] != '\\'):
            in_template = not in_template
        
        # Only count brackets outside template literals
        if not in_template:
            if char == '{': brace_count += 1
            elif char == '}': brace_count -= 1
            elif char == '(': paren_count += 1
            elif char == ')': paren_count -= 1
            elif char == '[': bracket_count += 1
            elif char == ']': bracket_count -= 1
        
        i += 1
    
    print('🔍 ANÁLISIS SINTÁCTICO:')
    print(f'Template literal abierto: {"❌ SÍ" if in_template else "✅ NO"}')
    print(f'Llaves desbalanceadas: {"❌ " + str(brace_count) if brace_count != 0 else "✅ 0"}')
    print(f'Paréntesis desbalanceados: {"❌ " + str(paren_count) if paren_count != 0 else "✅ 0"}')
    print(f'Corchetes desbalanceados: {"❌ " + str(bracket_count) if bracket_count != 0 else "✅ 0"}')
    
    if in_template or brace_count != 0 or paren_count != 0 or bracket_count != 0:
        print('\n⚠️  ERRORES ENCONTRADOS. Buscando línea problemática...')
        
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            if '`' in line or '${' in line:
                print(f'Línea {line_num}: {line[:100]}')
        
        return False
    
    return True

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(f'Uso: python3 {sys.argv[0]} <archivo.js>')
        sys.exit(1)
    
    filepath = sys.argv[1]
    if check_syntax(filepath):
        print('\n✅ Archivo sintácticamente correcto')
        sys.exit(0)
    else:
        print('\n❌ Archivo con errores sintácticos')
        sys.exit(1)