# bkr

Beaker CLI tool.
Clone, fork, develop, and publish P2P sites.

```
npm install -g bkr
```

Requires [beaker](https://github.com/beakerbrowser/beaker) to be running.
Tests are run in the Beaker test-suite.

## Usage

Command overview:

```bash

Usage: bkr <command> [opts...]

Publishing:

  init [directory] - create a new dat
  fork <dat-url|directory> [--cached] [directory] - create a new dat by copying
  status [directory] - check the change status of a dat
  publish [directory] - publish a new version of a dat

Fetching:

  clone <dat-url> [--cached] [directory] - copy a dat into a dir
  pull [--live] [directory] - pull the latest version of a dat

Open in beaker:

  open [directory] - open the dat in a folder
  dev [directory] - create and open a temporary live-watching dat

Management:

  ls [--mine] - list dats saved in beaker
  save <dat-url> - save a dat to beaker
  unsave <dat-url> - unsave a dat from beaker
```

## Examples

### Create a site

```bash
$ mkdir ~/my-site
$ cd ~/my-site
$ bkr init

# will give you a url, but the site is empty

$ echo "Hello, world!" > index.html
$ bkr publish

# site now has an index.html

$ echo "<br><br>Goodbye, world!" >> index.html
$ bkr publish

# site now has a BETTER index.html!
```

### Work on a site

When working, use `bkr dev` to create a temporary live-watching site.
(The site is temporary so that your in-progress changes dont get published out into the network.)

```bash
$ bkr clone dat://0ff7d4c7644d0aa19914247dc5dbf502d6a02ea89a5145e7b178d57db00504cd/ ~/my-site
$ cd ~/my-site
$ bkr dev 

# after the work is done...

$ bkr publish major
```

### Fork a site

```bash
$ bkr fork dat://0ff7d4c7644d0aa19914247dc5dbf502d6a02ea89a5145e7b178d57db00504cd/ ~/my-fork
$ cd ~/my-fork

$ echo "My fork has no regard for the previous index.html" > index.html
$ bkr publish 1.0.0
```

## .datignore

Similar to .gitignore, you can specify a .datignore file to exclude files from publishing.

## Reference

### Status

```
bkr status [directory]
```

Show the status of the site, including changed files.
If no directory is provided, it will use the current directory.

Use this command to see what changes will be published on `bkr publish`.

### Init

```
bkr init [directory]
```

Initialize a new dat site in the given directory.
If no directory is provided, it will use the current directory.

Bkr will ask you a series of questions, to populate the manifest.
When finished, bkr will emit the new URL.

Effects:

 - A new site is created.
 - The new site is saved to Beaker.
 - The new site is hosted on the network.
 - A dat.json manifest file is created in the directory.

### Clone

```
bkr clone <dat-url> [--cached] [directory]
```

Check out a copy of a dat site into the given directory.
If no directory is provided, it will use the current directory.

If the archive is not yet downloaded into Beaker's internal cache, `bkr` will attempt to finish the download first.
You can skip the download, and just clone what you have available, using `--cached`.

### Fork

```
bkr fork <dat-url|directory> [--cached] [directory]
```

Create a new dat site, using the given dat-url or directory as a template.
This is similar to running `bkr clone`, deleting the `dat.json`, then running `bkr init`.

If no second directory is given, it will use the current directory.
You can fork a checked-out dat site in place by running `bkr fork .`.

If the archive is not yet downloaded into Beaker's internal cache, `bkr` will attempt to finish the download first.
You can skip the download, and just clone what you have available, using `--cached`.

Effects:

 - A new site is created.
 - The new site is saved to Beaker.
 - The new site is hosted on the network.
 - All files from the original site, except dat.json, are copied into the new site.
 - A new dat.json is created.

### Open

```
bkr open [directory]
```

View the given dat in your browser.

### Pull

```
bkr pull [directory]
```

Pull any recent updates to the dat in the given directory.
This command will automatically overwrite any changes in the directory.
If no directory is provided, it will use the current directory.

### Publish

```
bkr publish[directory]
```

Publish a new version of the given directory.
Will update the dat site's files with any changes made since the last publish.
If no directory is provided, it will use the current directory.

This command will NOT fail if you forgot to pull latest before publishing.

Similar to .gitignore, you can specify a .datignore file to exclude files from publishing.

Effects:

 - Write the new files to the dat site.

### Dev

```
bkr dev [directory]
```

Create a temporary live-watching dat for development.
It will emit the URL of the temporary site.
If no directory is provided, it will use the current directory.

Use this command when you're working on a site, and want to see the changes as you work.
The site is temporary so that your in-progress changes dont get published out into the network.

### List

```
bkr ls [--mine]
```

List the Dat sites you have saved in Beaker.

To only show the sites you own, use `--mine`.

### Save

```
bkr save <dat-url>
```

Add a site to your saved sites in Beaker.
Beaker will start looking for the site on the network immediately.

### Unsave

```
bkr unsave <dat-url>
```

Remove a site to your saved sites in Beaker.
Beaker will garbage-collect the data later.


## Ignored Files

By default, `.git` and `.dat` are ignored, and will not be published.
