import { Project, SyntaxKind } from "ts-morph";
import * as fs from 'fs';

const project = new Project();
project.addSourceFileAtPath("src/App.tsx");
const sourceFile = project.getSourceFileOrThrow("src/App.tsx");

// Get the default export function App
const appFunction = sourceFile.getFunction("App") || sourceFile.getFunctions().find(f => f.getName() === "App" || f.isDefaultExport());

if (appFunction) {
    const body = appFunction.getBody();
    if (body && body.getKind() === SyntaxKind.Block) {
        const statements = body.getStatements();
        console.log(`App function has ${statements.length} statements.`);
        
        let returnStatementIndex = -1;
        for (let i = 0; i < statements.length; i++) {
            if (statements[i].getKind() === SyntaxKind.ReturnStatement && i > 100) {
                returnStatementIndex = i;
            }
        }
        
        console.log(`Main return statement is at index ${returnStatementIndex}`);
        
        // This confirms the logic and return statement
    }
}
