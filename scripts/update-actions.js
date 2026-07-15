const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, '../src/app/actions');
const filesToUpdate = [
  'authors.ts', 'blogs.ts', 'categories.ts', 'contact.ts', 
  'layout-settings.ts', 'moderation.ts', 'products.ts', 'users.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(actionsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import
    if (!content.includes("import { clearCacheByTag }")) {
      content = content.replace(
        "import { revalidatePath } from 'next/cache';",
        "import { revalidatePath } from 'next/cache';\nimport { clearCacheByTag } from './revalidate';"
      );
    }
    
    // Add clearCacheByTag('admin-update'); after revalidatePath('/admin');
    // or just before return { success: true...
    // Actually replacing revalidatePath('/admin'); with revalidatePath('/admin'); clearCacheByTag('admin-update');
    // Or just replacing all "return { success: true" with "clearCacheByTag('admin-update');\n    return { success: true"
    
    // Let's just regex to find return { success: true and prepend clearCacheByTag
    // Except it might be called in different ways.
    // It's safer to find revalidatePath('/admin'); and replace it.
    
    if (content.includes("revalidatePath('/admin');")) {
      content = content.replace(/revalidatePath\('\/admin'\);/g, "revalidatePath('/admin');\n    clearCacheByTag('admin-update');");
    } else {
       // if there is no revalidatePath('/admin'); let's just find any revalidatePath and append after it.
       // or just look for the success return.
       content = content.replace(/return { success: true/g, "clearCacheByTag('admin-update');\n    return { success: true");
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
