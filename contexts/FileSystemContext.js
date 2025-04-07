"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Default files to initialize with
const DEFAULT_FILES = {
  contracts: {
    type: "folder",
    children: {
      "Storage.sol": {
        type: "file",
        content: `// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Storage {
    uint256 number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }
}`,
      },
    },
  },
  scripts: {
    type: "folder",
    children: {},
  },
  tests: {
    type: "folder",
    children: {},
  },
  "README.txt": {
    type: "file",
    content: `# RemixID Clone

This is a clone of RemixID for Solidity smart contract development.

## Features
- File system management
- Solidity code editing
- Smart contract compilation
- Contract deployment to Ethereum networks
- Metamask integration`,
  },
};

const FileSystemContext = createContext();

export function useFileSystem() {
  return useContext(FileSystemContext);
}

export function FileSystemProvider({ children }) {
  const [fileSystem, setFileSystem] = useState(() => {
    // Try to load from localStorage, or use default
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("remix-clone-filesystem");
      return saved ? JSON.parse(saved) : DEFAULT_FILES;
    }
    return DEFAULT_FILES;
  });

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  // Save to localStorage when fileSystem changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "remix-clone-filesystem",
        JSON.stringify(fileSystem)
      );
    }
  }, [fileSystem]);

  // Create a new file or folder
  const createItem = (path, type, initialContent = "") => {
    const pathParts = path.split("/").filter(Boolean);
    const name = pathParts.pop();

    // Build the full path to the parent directory
    let currentObj = fileSystem;
    let currentPath = "";

    for (const part of pathParts) {
      currentPath += "/" + part;
      if (!currentObj[part] || currentObj[part].type !== "folder") {
        return false; // Parent path doesn't exist or isn't a folder
      }
      currentObj = currentObj[part].children;
    }

    // If an item with this name already exists in this location, don't overwrite
    if (currentObj[name]) {
      return false;
    }

    // Create the new item
    if (type === "file") {
      currentObj[name] = { type: "file", content: initialContent };
    } else if (type === "folder") {
      currentObj[name] = { type: "folder", children: {} };
    }

    setFileSystem({ ...fileSystem });
    return true;
  };

  // Delete a file or folder
  const deleteItem = (path) => {
    const pathParts = path.split("/").filter(Boolean);
    const name = pathParts.pop();

    let currentObj = fileSystem;
    for (const part of pathParts) {
      if (!currentObj[part] || currentObj[part].type !== "folder") {
        return false;
      }
      currentObj = currentObj[part].children;
    }

    if (!currentObj[name]) {
      return false;
    }

    // If it's an open file, close it
    if (currentObj[name].type === "file") {
      const fullPath = "/" + [...pathParts, name].join("/");
      setOpenFiles((prev) => prev.filter((f) => f.path !== fullPath));
      if (currentFile?.path === fullPath) {
        setCurrentFile(openFiles.length > 0 ? openFiles[0] : null);
      }
    }

    delete currentObj[name];
    setFileSystem({ ...fileSystem });
    return true;
  };

  // Update file content
  const updateFileContent = (path, content) => {
    const pathParts = path.split("/").filter(Boolean);
    const name = pathParts.pop();

    let currentObj = fileSystem;
    for (const part of pathParts) {
      if (!currentObj[part] || currentObj[part].type !== "folder") {
        return false;
      }
      currentObj = currentObj[part].children;
    }

    if (!currentObj[name] || currentObj[name].type !== "file") {
      return false;
    }

    currentObj[name].content = content;
    setFileSystem({ ...fileSystem });

    // Also update the content in openFiles
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.path === "/" + [...pathParts, name].join("/")
          ? { ...file, content }
          : file
      )
    );

    return true;
  };

  // Get file content
  const getFileContent = (path) => {
    const pathParts = path.split("/").filter(Boolean);
    const name = pathParts.pop();

    let currentObj = fileSystem;
    for (const part of pathParts) {
      if (!currentObj[part] || currentObj[part].type !== "folder") {
        return null;
      }
      currentObj = currentObj[part].children;
    }

    if (!currentObj[name] || currentObj[name].type !== "file") {
      return null;
    }

    return currentObj[name].content;
  };

  // Open a file
  const openFile = (path) => {
    const content = getFileContent(path);
    if (content === null) return false;

    // Check if file is already open
    if (!openFiles.some((file) => file.path === path)) {
      const newOpenFile = {
        id: uuidv4(),
        path,
        name: path.split("/").pop(),
        content,
      };
      setOpenFiles([...openFiles, newOpenFile]);
    }

    // Set as current file
    setCurrentFile(
      openFiles.find((file) => file.path === path) || {
        id: uuidv4(),
        path,
        name: path.split("/").pop(),
        content,
      }
    );

    return true;
  };

  // Close a file
  const closeFile = (path) => {
    const fileIndex = openFiles.findIndex((file) => file.path === path);
    if (fileIndex === -1) return false;

    const newOpenFiles = [...openFiles];
    newOpenFiles.splice(fileIndex, 1);
    setOpenFiles(newOpenFiles);

    // If it was the current file, set a new current file
    if (currentFile?.path === path) {
      if (newOpenFiles.length > 0) {
        // Prefer to select the adjacent file
        const nextIndex = Math.min(fileIndex, newOpenFiles.length - 1);
        setCurrentFile(newOpenFiles[nextIndex]);
      } else {
        setCurrentFile(null);
      }
    }

    return true;
  };

  // Rename a file or folder
  const renameItem = (path, newName) => {
    const pathParts = path.split("/").filter(Boolean);
    const name = pathParts.pop();

    let currentObj = fileSystem;
    for (const part of pathParts) {
      if (!currentObj[part] || currentObj[part].type !== "folder") {
        return false;
      }
      currentObj = currentObj[part].children;
    }

    if (!currentObj[name]) {
      return false;
    }

    // Check if new name already exists
    if (currentObj[newName]) {
      return false;
    }

    // Copy the item with the new name
    currentObj[newName] = currentObj[name];
    delete currentObj[name];

    // Update open files reference if it's a file
    if (currentObj[newName].type === "file") {
      const oldPath = "/" + [...pathParts, name].join("/");
      const newPath = "/" + [...pathParts, newName].join("/");

      setOpenFiles((prev) =>
        prev.map((file) =>
          file.path === oldPath
            ? { ...file, path: newPath, name: newName }
            : file
        )
      );

      if (currentFile?.path === oldPath) {
        setCurrentFile((prev) => ({ ...prev, path: newPath, name: newName }));
      }
    }

    setFileSystem({ ...fileSystem });
    return true;
  };

  const value = {
    fileSystem,
    currentFile,
    openFiles,
    createItem,
    deleteItem,
    updateFileContent,
    getFileContent,
    openFile,
    closeFile,
    renameItem,
    setCurrentFile,
  };

  return (
    <FileSystemContext.Provider value={value}>
      {children}
    </FileSystemContext.Provider>
  );
}
