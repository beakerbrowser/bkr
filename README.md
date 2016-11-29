# bkr

Beaker CLI tool.
Clone, fork, develop, and publish P2P sites.

```
npm install -g bkr
```

Requires [beaker](https://github.com/beakerbrowser/beaker) to be running.

## Usage

Command overview:

```bash
# initiate a dat site
bkr init [directory]
bkr co <dat-url> [directory]
bkr fork <dat-url|directory> [directory]

# update/manage a site
bkr status [directory]
bkr pull [directory]
bkr publish [major|minor|patch|{version}] [directory]
bkr dev [directory]

# list/manage saved sites
bkr ls [--mine]
bkr add <dat-url>
bkr rm <dat-url>
bkr host <dat-url>
bkr unhost <dat-url>
```

Bkr is more like NPM than Git.
It is for publishing on the dat network, not source-control.
It can not diff versions of a site, or help you merge them together.
We suggest you use it with git!

## Development Status

**Currently will not work.**
Beaker 0.5.0 must be published before bkr will be able to connect to it.

Implemented commands:

- [x] init
- [x] co
- [x] fork
- [ ] status
- [x] pull
- [x] publish
- [ ] dev
- [x] ls
- [x] add
- [x] rm
- [x] host
- [x] unhost

## Examples

### Create a site

```bash
$ mkdir ~/my-site
$ cd ~/my-site
$ bkr init

Initializing /Users/bob/my-site

This utility will walk you through creating a dat.json file.
It only covers the most common items, and tries to guess sensible defaults.

? title: my-site
? description: My new site
? author: Bob Roberts

About to write /Users/bob/my-site/dat.json

{
  "title": "my-site",
  "description": "My new site",
  "author": "Bob Roberts"
} 

? Is this ok? Yes

Created new dat
dat://110382ee22c3fd6a853c3e83d930904ceaa9aa51859c82da6a918b69371f51db/

$ echo "Hello, world!" > index.html
$ bkr publish 1.0.0

$ echo "<br><br>Goodbye, world!" >> index.html
$ bkr publish 1.0.1
```

### Work on a site

When working, use `bkr dev` to create a temporary live-watching site.
(The site is temporary so that your in-progress changes dont get published out into the network.)

```bash
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

### Checkout

```
bkr co <dat-url> [directory]
```

Check out a copy of a dat site into the given directory.
If no directory is provided, it will use the current directory.

Use this command to work on a site that you own, and have saved, or to simply get the files from a site you don't own.
You can publish your changes with the `publish` command.

### Fork

```
bkr fork <dat-url|directory> [directory]
```

Create a new dat site, using the given dat-url or directory as a template.
This is similar to running `bkr co`, deleting the `dat.json`, then running `bkr init`.

If no second directory is given, it will use the current directory.
You can fork a checked-out dat site in place by running `bkr fork .`.

Effects:

 - A new site is created.
 - The new site is saved to Beaker.
 - The new site is hosted on the network.
 - All files from the original site, except dat.json, are copied into the new site.
 - A new dat.json is created.

### Pull

```
bkr pull [directory]
```

Pull any recent updates to the dat in the given directory.
This command will automatically overwrite any changes in the directory.
If no directory is provided, it will use the current directory.

### Publish

```
bkr publish [major|minor|patch|{version}] [directory]
```

Publish a new version of the given directory.
Will update the dat site's files with any changes made since the last publish.
If no directory is provided, it will use the current directory.

If you want to specify a specific version, you can do so, eg `bkr publish 1.2.3`.
For convenience, you can use major/minor/patch to bump those version segments, respectively.

This command will fail if you attempt to publish a version that has already been published.
This command will NOT fail if you forgot to pull latest before publishing.

Effects:

 - Update the version in dat.json, if a version was specified.
 - Write the new files to the dat site.
 - Write a new checkpoint to the dat site, using the version in dat.json.

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

### Add

```
bkr add <dat-url>
```

Add a site to your saved sites in Beaker.
Beaker will start looking for the site on the network immediately.

### Remove

```
bkr rm <dat-url>
```

Remove a site to your saved sites in Beaker.
Beaker will garbage-collect the data later.

### Host

```
bkr host <dat-url>
```

Serve the given site to the network.
You must add the site before hosting it.

### Unhost

```
bkr unhost <dat-url>
```

Stop serving the given site to the network.

## Ignored Files

By default, `.git` and `.dat` are ignored, and will not be published.
