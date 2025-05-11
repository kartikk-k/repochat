import { useStore } from "@/store/useStore";

function buildTreeString(nodes: any, prefix = '') {
    let tree = '';
    nodes.forEach((node: any, idx: any) => {
        const isLast = idx === nodes.length - 1;
        const { name, type, children } = node;
        const connector = isLast ? '└── ' : '├── ';
        
        tree += prefix + connector + name + (type === 'dir' ? '/' : '') + '\n';

        if (type === 'dir' && children?.length) {
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            tree += buildTreeString(children, newPrefix);
        }
    });
    return tree;
}

export default function getFolderStructure() {
    const store = useStore.getState()
    const { fileData } = store

    const tree = '/\n' + buildTreeString(fileData)
    return tree
}   
