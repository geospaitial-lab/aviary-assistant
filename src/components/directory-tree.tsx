/*
 * Copyright (C) 2025 Marius Maryniak
 *
 * This file is part of aviary-assistant.
 *
 * aviary-assistant is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * aviary-assistant is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with aviary-assistant.
 * If not, see <https://www.gnu.org/licenses/>.
 */
import * as React from "react"

import { File, Folder } from "lucide-react"

import { cn } from "@/lib/utils"

export type DirectoryNode = {
  name: string
  type: "folder" | "file"
  children?: DirectoryNode[]
}

export interface DirectoryTreeProps {
  items: DirectoryNode[]
  className?: string
  ariaLabel?: string
}

export function DirectoryTree({
  items,
  className,
  ariaLabel,
}: DirectoryTreeProps) {
  return (
    <ul
      className={cn("list-none m-0 p-0 text-sm", className)}
      role="tree"
      aria-label={ariaLabel}
    >
      {items.map((item, idx) => (
        <DirectoryTreeItem key={`${item.name}-${idx}`} item={item} depth={0} />
      ))}
    </ul>
  )
}

function DirectoryTreeItem({
  item,
  depth,
}: {
  item: DirectoryNode
  depth: number
}) {
  const isFolder = item.type === "folder"

  return (
    <li
      role="treeitem"
      aria-expanded={isFolder ? true : undefined}
      className="m-0"
    >
      <div
        className={cn(
          "flex items-center gap-2 py-1",
          depth > 0 && "pl-4",
          depth > 1 && "pl-6",
          depth > 2 && "pl-8",
        )}
      >
        {isFolder ? (
          <Folder
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <File
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <span className="leading-5 break-words">{item.name}</span>
      </div>

      {isFolder && item.children && item.children.length > 0 && (
        <ul role="group" className="list-none m-0 p-0">
          {item.children.map((child, idx) => (
            <DirectoryTreeItem
              key={`${child.name}-${depth + 1}-${idx}`}
              item={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
