# Folder Icon Setter

This repository provides a Node.js script that sets the icon of a specified directory using the first image file in that directory.

OS: Windows 11/10

## Note
This script uses the first PNG or JPG/JPEG file in the specified directory.
Files are sorted in alphabetical order, and the first file is selected.
If there is no image in the directory to use as an icon, the script does nothing.

Also, due to Windows specifications, the contents of `desktop.ini` may not be reflected (i.e., the folder icon does not change). The cause of this is unknown.

Internally, the following is executed at the end.
This is to reflect the changes to `desktop.ini`.
```bash
attrib -s -h ${dirPath}
attrib +s +h ${desktopIniPath}
attrib +r ${dirPath} //Required to display icons

//Required to update icon
attrib +s ${dirPath}
attrib -s ${dirPath}
```


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

4. Run the script. Specify the path of the directory you want to set the icon for as an argument.
```bash
node index.js path
```

#### LICENSE
MIT