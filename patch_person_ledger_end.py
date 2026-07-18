import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

# Replace the second </table> with </table></div></div>
parts = content.split("</table>")
if len(parts) == 3:
    content = parts[0] + "</table>" + parts[1] + "</table>\n                                      </div>\n                                    </div>" + parts[2]
else:
    print("Warning: Expected exactly 2 </table> tags, found", len(parts) - 1)

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
