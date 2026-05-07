'use client'
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

interface TreeNodeData {
  id: string;
  name: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: TreeNodeData[];
}

const DragDropTree = () => {

  const [treeData, setTreeData] = useState<TreeNodeData>({
    id: 'root',
    name: 'Root',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        expanded: false,
        children: [
          { id: '2', name: 'report.pdf', type: 'file' },
          { id: '3', name: 'notes.txt', type: 'file' },
          {
            id: '4',
            name: 'Projects',
            type: 'folder',
            expanded: false,
            children: [
              { id: '5', name: 'project1.md', type: 'file' },
              { id: '6', name: 'project2.md', type: 'file' }
            ]
          }
        ]
      },
    {
      id: '7',
      name: 'Images',
      type: 'folder',
      expanded: true,
      children: [
        { id: '8', name: 'photo1.jpg', type: 'file' },
        { id: '9', name: 'photo2.png', type: 'file' }
      ]
    }
  ]
});

// Recursively find and update a node
type UpdateNodeFn = (node: TreeNodeData) => TreeNodeData;

const updateNode = (
  node: TreeNodeData,
  targetId: string,
  updater: UpdateNodeFn
): TreeNodeData => {
  if (node.id === targetId) {
    return updater(node);
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map(child => updateNode(child, targetId, updater))
    };
  }
  return node;
};

// Recursively find and remove a node
interface RemoveNodeFn {
  (node: TreeNodeData, targetId: string): TreeNodeData;
}

const removeNode: RemoveNodeFn = (node, targetId) => {
  if (node.children) {
    const filtered = node.children.filter(child => child.id !== targetId);
    return {
      ...node,
      children: filtered.map(child => removeNode(child, targetId))
    };
  }
  return node;
};



interface ToggleExpandedFn {
  (nodeId: string): void;
}

const toggleExpanded: ToggleExpandedFn = (nodeId) => {
  setTreeData(prev =>
    updateNode(prev, nodeId, (node: TreeNodeData) => ({ ...node, expanded: !node.expanded }))
  );
};

interface DraggedItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    expanded?: boolean;
    children?: TreeNodeData[];
}

const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
const [dropTarget, setDropTarget] = useState<string | null>(null);

const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: DraggedItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
};

const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
};

interface HandleDragEnterItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    expanded?: boolean;
    children?: TreeNodeData[];
}

const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, item: HandleDragEnterItem) => {
    e.preventDefault();
    if (item.type === 'folder' && item.id !== draggedItem?.id) {
        setDropTarget(item.id);
    }
};

const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear drop target if we're leaving the tree area
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setDropTarget(null);
    }
};


const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetFolder: TreeNodeData
): void => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedItem || !targetFolder || targetFolder.type !== 'folder') {
        setDropTarget(null);
        return;
    }

    // Prevent dropping folder into itself or its descendants
    const isDescendant = (
        parent: TreeNodeData,
        childId: string
    ): boolean => {
        if (parent.id === childId) return true;
        if (parent.children) {
            return parent.children.some(child => isDescendant(child, childId));
        }
        return false;
    };

    if (isDescendant(draggedItem, targetFolder.id)) {
        setDropTarget(null);
        return;
    }

    // Remove item from current location
    let newTreeData: TreeNodeData = removeNode(treeData, draggedItem.id);
    
    // Add item to target folder
    newTreeData = updateNode(newTreeData, targetFolder.id, (folder: TreeNodeData) => ({
        ...folder,
        expanded: true, // Auto-expand when dropping
        children: [...(folder.children || []), draggedItem]
    }));

    setTreeData(newTreeData);
    setDropTarget(null);
    setDraggedItem(null);
};

  const TreeNode: React.FC<{ node: TreeNodeData; level?: number }> = ({ node, level = 0 }) => {
    const isFolder = node.type === 'folder';
    const hasChildren = node.children && node.children.length > 0;
    const isDropTarget = dropTarget === node.id;
    const isDragging = draggedItem?.id === node.id;

    return (
      <div className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer transition-colors duration-150 ${
            isDragging ? 'opacity-50' : ''
          } ${
            isDropTarget ? 'bg-blue-100 border-2 border-blue-300 rounded' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          draggable
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, node)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, node)}
          onClick={() => isFolder && toggleExpanded(node.id)}
        >
          <div className="flex items-center min-w-0 flex-1">
            {isFolder ? (
              <>
                <div className="w-4 h-4 mr-1 flex-shrink-0">
                  {hasChildren ? (
                    node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  ) : (
                    <div className="w-4" />
                  )}
                </div>
                <div className="w-4 h-4 mr-2 flex-shrink-0 text-blue-600">
                  {node.expanded && hasChildren ? <FolderOpen size={16} /> : <Folder size={16} />}
                </div>
              </>
            ) : (
              <>
                <div className="w-4 mr-1" />
                <div className="w-4 h-4 mr-2 flex-shrink-0 text-gray-500">
                  <File size={16} />
                </div>
              </>
            )}
            <span className="truncate text-sm">{node.name}</span>
          </div>
        </div>
        
        {isFolder && node.expanded && hasChildren && (
          <div>
            {node.children?.map(child => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Folder className="w-4 h-4 mr-2 text-blue-600" />
             📂📁
            File Explorer
          </h3>
        </div>
        <div className="p-2 max-h-96 overflow-y-auto">
          <TreeNode node={treeData} />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <strong>Instructions:</strong> Click folders to expand/collapse. Drag files and folders to move them. 
        Folders auto-expand when you drop items into them.
      </div>
    </div>
  );
};

export default DragDropTree;