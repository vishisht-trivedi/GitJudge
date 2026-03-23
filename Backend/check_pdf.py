import subprocess

# Check if pdf-parse is installed
r1 = subprocess.run(['node', '-e', "try { require('pdf-parse'); console.log('OK'); } catch(e) { console.log('MISSING:', e.message); }"],
    capture_output=True, text=True, cwd='/home/visi/linux_entry/GitJudge/Backend')
print('pdf-parse check:', r1.stdout.strip(), r1.stderr.strip())

# Check if multer is installed
r2 = subprocess.run(['node', '-e', "try { require('multer'); console.log('OK'); } catch(e) { console.log('MISSING:', e.message); }"],
    capture_output=True, text=True, cwd='/home/visi/linux_entry/GitJudge/Backend')
print('multer check:', r2.stdout.strip(), r2.stderr.strip())

# Check package.json deps
r3 = subprocess.run(['node', '-e', "const p=require('./package.json'); console.log(JSON.stringify(p.dependencies, null, 2))"],
    capture_output=True, text=True, cwd='/home/visi/linux_entry/GitJudge/Backend')
print('deps:', r3.stdout.strip())
