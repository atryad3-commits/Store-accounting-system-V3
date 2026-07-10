with open("src/App.tsx", "r") as f:
    app = f.read()

old_footer_div = """<div className="flex items-center gap-3 text-indigo-900 border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 rounded-lg">"""
new_footer_div = """<div 
                  onClick={() => setIsChangelogModalOpen(true)}
                  className="flex items-center gap-3 text-indigo-900 border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-100/50 transition-colors"
                >"""
app = app.replace(old_footer_div, new_footer_div)

# And add the modal at the end of the return statement
modal_code = """
        <ChangelogModal 
          isOpen={isChangelogModalOpen} 
          onClose={() => setIsChangelogModalOpen(false)} 
        />
"""

if "<ChangelogModal" not in app:
    app = app.replace("</AnimatePresence>\n    </ToastProvider>", modal_code + "</AnimatePresence>\n    </ToastProvider>")

with open("src/App.tsx", "w") as f:
    f.write(app)
