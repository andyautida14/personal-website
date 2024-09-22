---
title: I Made a Database from Scratch
description: Showing off a database I made in Go. (Almost) Zero dependencies!
date: 2024-01-28
tags:
  - database
  - go
  - from scratch
draft: true
---

Most non-trivial software projects will require a durable way of storing data for later use. That is the role of the Database in a software system. Software engineers would usually just pick one or several databases for a project from a huge catalog of free and paid solutions. These databases are commonly treated as a [Black Box](https://en.wikipedia.org/wiki/Black_box); the low-level details of organizing and storing bytes of data to disk are abstracted behind its interface, in which most programmers are only familiar with.

Through my years of experience in making software, I encountered several types of databases and learned which ones to use in certain situations. At the same time, my curiousity only grew on how these black boxes work underneath their convenient interfaces. To be able to satisfy this curiousity, I started creating a project that can, at the very least, be barely called a database. The main goal of this project is to gain a better understanding of how databases work internally, and hopefully by writing this blog post, others may benefit from this curious exporation as well.

The full project can be cloned and forked [here](https://github.com/andyautida14/kv-db).

## Basic Concepts

Before I walk through the code, let's first learn some basic knowledge and ideas that will be the foundation of the implementation.

Computers usually have hard disks attached to them which are used for long-term storage of data. Hard disks store data in **binary** format, or in other words, a humongous series of 1's and 0's (a.k.a. bits). Then the **File System** of an Operating System like Windows or Linux ([GNU/Linux?](https://stallman-copypasta.github.io/)) provides an abstraction layer to read/write from/to disk in form of *files* that we're all familiar with. And then, **Databases** utilize the File System's API to organize, store and retrieve data in files. Finally, **Applications** use Databases for long-term data storage and retrieval.

### Binary Encoding

Since we are saving binary data to disk, it is important that we know how to convert the data values we're familiar with to and from binary.

We are all taught that computers only use the binary, the ones and zeroes, to do its thing. To the people who do not have a background in Computer Science, it might not make sense because a computer can do computations on numbers bigger, smaller and in-between 1 and 0 as well. It can also display letters, and even photos and videos.

All it comes down to is that when you combine multiple bits, the permutation of the values of each bit can represent anything from numbers, to letters, to colors. For example, a group of 8 bits, which forms a **byte**, can now represent other numbers (non-negative) that are not 0 nor 1:

| binary    | decimal |
|:---------:|:-------:|
| 00000000  | 0       |
| 00000001  | 1       |
| 00000010  | 2       |
| 00000011  | 3       |
| 00000100  | 4       |
| ...       | ...     |
| 11111111  | 256     |

A byte can represent numbers from 0 to 256. Computers perform addition, or any other arithmetic operations, on two different bytes and correctly calculate the result in byte as well. The byte result can then be displayed in decimal form (using digits 0-9), in which the user is familiar with. If a number higher than 256 is needed, we just need to add more bits. For every bit added, the maximum value that can be represented doubles. Usually, the number of bytes are grouped together in units of 1, 2, 4, 8, etc. (8 bits, 16 bits, 32 bits, 64 bits)

To represent English characters and some commonly used special characters the [ASCII](https://www.ascii-code.com/) standard is used. In ASCII, certain binary numbers represent characters. To name a few:

| binary    | decimal | character |
|:---------:|:-------:|:---------:|
| 01000001  | 65      | A         |
| 01000010  | 66      | B         |
| 01000011  | 67      | C         |
| ...       | ...     | ...       |
| 01011010  | 90      | Z         |
| 01100001  | 97      | a         |
| 01100010  | 98      | b         |
| 01100011  | 99      | c         |
| ...       | ...     | ...       |
| 01111010  | 172     | z         |

The characters are then stringged together to form a **string of characters** (a.k.a. **string**), such as "Hello World!"

### Files

As mentioned earlier, the File System provides an interface/abstraction to read/write from/to the disk. When executing read or write operations, most programs do not have to deal with identifying the exact location on the disk. Instead, programs only need to know which file to read from/write to. It is also possible for a file to be split into many parts (a.k.a. fragmented) when saved into the disk, but when a program reads it, it appears as if it's just one, continuous large array.

A file can be treated as a dynamic array of bytes that can be freely extended or truncated. By encoding the data in binary form and cleverly organizing them in the file, read and write operations can be efficiently perfomed. And that is basically the main purpose of a database: to provide an abstraction layer of reading/writing from/to files for applications.

### Binary Search

One simple way of organizing data is storing them in ascending order. Think of a dictionary, where each word is sorted alphabetically, which makes it easy to find words and know when a certain word does not exist. Databases store data like this in an **index**, and then perform **Binary Search** when looking for the data. And that is how databases are able to find the specific requested data from potentially millions (or more) of other data in a fraction of a second.

To be able to fully appreciate sorted data and binary search, let's first consider searching **Lewis** in an unsorted list of residents:

<div class="flex-container flex-gap linear-search">

<style>
.linear-search .step-1 {
  tbody tr:nth-child(1) {
    background: red;
  }
}

.linear-search .step-2 {
  tbody tr:nth-child(2) {
    background: red;
  }
}

.linear-search .step-3 {
  tbody tr:nth-child(3) {
    background: red;
  }
}
</style>

<div class="step-1">

| | Resident  |
|-|-----------|
|>| Marnie    |
| | Jas       |
| | Lewis     |
| | Vincent   |
| | Pierre    |
| | Abigail   |
| | Rasmodius |
| | Dwarf     |
| | Krobus    |
| | Leah      |
| | Penny     |

</div>

<div class="step-2">

| | Resident  |
|-|-----------|
| | Marnie    |
|>| Jas       |
| | Lewis     |
| | Vincent   |
| | Pierre    |
| | Abigail   |
| | Rasmodius |
| | Dwarf     |
| | Krobus    |
| | Leah      |
| | Penny     |

</div>

<div class="step-3">

| | Resident  |
|-|-----------|
| | Marnie    |
| | Jas       |
|>| Lewis     |
| | Vincent   |
| | Pierre    |
| | Abigail   |
| | Rasmodius |
| | Dwarf     |
| | Krobus    |
| | Leah      |
| | Penny     |

</div>

</div>

In this example, it took 3 steps to find Lewis. It's doesn't seem that much, but if Lewis happened to be the last item in the list, the number of steps will be the length of the list. Now imagine if this is a large city with hundreds of thousands of residents.

This is called **Linear Search**, a method of finding an item in a list by looking at all the items one-by-one. In the worst case scenario, the the number of steps it will take to find something will grow as the number of items on the list grows. In Algorithms-speak, it has **O(n)** (pronouced oh-of-n) complexity, where **n** is the number of items to search from. In an unsorted list, this is the only way to find an item in it, and it is inefficient.

With a sorted list, we can perform binary search:

<div class="flex-container flex-gap binary-search">

<style>
.binary-search .step-1 {
  tbody {
    background: yellow;
  }
  tbody tr:nth-child(5) {
    background: red;
  }
}

.binary-search .step-2 {
  tbody tr:nth-child(n+6) {
    background: yellow;
  }
  tbody tr:nth-child(8) {
    background: red;
  }
}

.binary-search .step-3 {
  tbody tr:nth-child(7) {
    background: yellow;
  }
  tbody tr:nth-child(6) {
    background: red;
  }
}
</style>

<div class="step-1">

| | Resident  |
|-|-----------|
| | Abigail   |
| | Dwarf     |
| | Jas       |
| | Krobus    |
|>| Leah      |
| | Lewis     |
| | Marnie    |
| | Penny     |
| | Pierre    |
| | Rasmodius |
| | Vincent   |

</div>

<div class="step-2">

| | Resident  |
|-|-----------|
| | Abigail   |
| | Dwarf     |
| | Jas       |
| | Krobus    |
| | Leah      |
| | Lewis     |
| | Marnie    |
|>| Penny     |
| | Pierre    |
| | Rasmodius |
| | Vincent   |

</div>

<div class="step-3">

| | Resident  |
|-|-----------|
| | Abigail   |
| | Dwarf     |
| | Jas       |
| | Krobus    |
| | Leah      |
|>| Lewis     |
| | Marnie    |
| | Penny     |
| | Pierre    |
| | Rasmodius |
| | Vincent   |

</div>

</div>

Binary Search works by immediately comparing the middle-most item in the list to the item we are searching for. If it happens that it's the item we're looking for, then we're done. If not, since the list is sorted, we'll know if the item we're searching for is positioned **before** or **after** the middle item. Then we will repeat what we just did, but only on the **before**- or **after**-section of the list where the item may exist. On each iteration, the section of the list where the item we're searching for may be located gets halved, and once there's only one item remaining, then we'll know if we found it or it doesn't exist in the list.

This makes Binary Search an **O(log n)** algorithm, where the number of steps it takes grows **logarithmically** as the number of items **n** grows. For reference, it will take **Linear Search** about 1000 steps for a list with 1000 items, while **Binary Search** will only take around 10, thus, significantly makes it more efficient.

## Implementation

Now that the basic concepts has been laid out, I'll talk about the code next. I chose [Go Programming Language](https://go.dev) for this project because it feels like doing binary-stuff with it is encouraged, very unlike the other languages that seems like it wants to hide the low-level bits and bytes from its users. It's not even uncommon to see popular libraries return or accept slices of bytes. Also, I feel like I'm not writing code using a programming language that could be my #1 favorite.

## Outline
* Implementation
  * Entity
  * Storage
  * Indexer
  * Collection
* Summary
  * Took longer than expected
  * Clean and simple implementation
  * Easily swappable components
  * Interfaces are very powerful in Go (and generics are overrated)
  * What's next
  * Link to GitHub