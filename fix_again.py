import re

with open('src/components/persons/PersonLedger.tsx', 'r') as f:
    content = f.read()

content = content.replace("</table>\n                                      </div>\n                                    </div>\n                                  );\n                                })()}", "</table>\n                                  );\n                                })()}")
content = content.replace("</table>\n                                      </div>\n                                    </div>\n                                  );\n                                })()", "</table>\n                                  );\n                                })()")
content = content.replace("</table>\n                                      </div>\n                                    </div>", "</table>")

with open('src/components/persons/PersonLedger.tsx', 'w') as f:
    f.write(content)
