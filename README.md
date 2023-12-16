# Folder Icon Setter

This repository provides a Node.js script that sets the icon of a specified directory using the first image file in that directory.

OS: Windows 11/10

## Note
This script uses the first PNG or JPG/JPEG file in the specified directory.
Files are sorted in alphabetical order, and the first file is selected.
If there is no image in the directory to use as an icon, the script does nothing.

Also, due to Windows specifications, the contents of `desktop.ini` may not be reflected (i.e., the folder icon does not change). The cause of this is unknown.

Internally, the following is executed at the end.
This is required to display icons.
```bash
attrib +r ${dirPath} //Required to display icons
```


The cause is unknown, but
```ini
[.ShellClassInfo].
IconResource=.*
```
may be erased by itself from desktop.ini.

If so,please run it again.

### If ICON does not change
try the following steps.
1. open the "Properties" of the folder
2. click on "Customize" from the tab
3. Make no changes and click "OK"


## Usage

1. Clone or download the repository.

```bash
git clone https://github.com/aurora1530/folder-icon-setter.git
```

2. Navigate to the downloaded directory.
```bash
cd folder-icon-setter
```

3. Install the necessary packages.
```bash
npm install
```

4. Compile the TypeScript files.
```bash
npm run compile
```

5. Run the script. Specify the path of the directory you want to set the icon for as an argument.
```bash
npm run setIcon path
```

You can also use wildcards in the directory argument for `node index.js`. This allows you to specify multiple directories at once. For example:

```bash
npm run setIcon dir1/* dir2/* dir3/*
```

#### LICENSE
MIT