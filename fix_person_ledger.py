import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

# First, fix the syntax error.
content = content.replace("</table>\n                                      </div>\n                                    </div>\n                                  );\n                                })()}", "</table>\n                                  );\n                                })()}")
# Also without the bracket
content = content.replace("</table>\n                                      </div>\n                                    </div>\n                                  );\n                                })()", "</table>\n                                  );\n                                })()")

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
