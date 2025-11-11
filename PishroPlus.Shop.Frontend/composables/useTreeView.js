import { ref, reactive } from 'vue'

export function useTreeView() {
  const treeViewData = reactive({
    model: [],
    active: [],
    originalData: null
  })
  const selectedNode = ref(null)

  function convertToTreeViewFormat(data, shouldOpen = false) {
    function convertNode(node) {
      return {
        id: node.id,
        title: node.name,
        code: node.code,
        hierarchicalCode: node.hierarchicalCode,
        hierarchicalName: node.hierarchicalName,
        draggable: false,
        open: shouldOpen,
        icon: node.children?.length ? 'mdi-folder' : 'mdi-file-outline',
        openedIcon: node.children?.length ? 'mdi-folder-open' : 'mdi-file-outline',
        children: node.children?.map(child => convertNode(child)) || []
      }
    }

    return [{
      id: data.id,
      title: data.name,
      code: data.code,
      hierarchicalCode: data.hierarchicalCode,
      hierarchicalName: data.hierarchicalName,
      draggable: false,
      open: shouldOpen,
      icon: 'mdi-folder',
      openedIcon: 'mdi-folder-open',
      children: data.children?.map(child => convertNode(child)) || []
    }]
  }

  function findSingleLeafNode(nodes) {
    let leafNodes = []
    
    function traverse(node) {
      if (!node.children || node.children.length === 0) {
        leafNodes.push(node)
      } else {
        node.children.forEach(traverse)
      }
    }
    
    nodes.forEach(traverse)
    
    return leafNodes.length === 1 ? leafNodes[0] : null
  }

  function updateTreeData(data) {
    treeViewData.originalData = data
    treeViewData.model = convertToTreeViewFormat(data)
  }

  function selectNode(node) {
    selectedNode.value = node
    treeViewData.active = [node]
  }

  function isLeafNode(node) {
    return !node.children || node.children.length === 0
  }

  function searchInTree(searchText) {
    if (!searchText) {
      treeViewData.model = convertToTreeViewFormat(treeViewData.originalData, false)
      return
    }

    const searchLower = searchText.toLowerCase()

    function nodeMatchesSearch(node) {
      return (
        node.name.toLowerCase().includes(searchLower) ||
        node.code.toLowerCase().includes(searchLower) ||
        node.hierarchicalCode.toLowerCase().includes(searchLower)
      )
    }

    function filterAndMarkNodes(node) {
      const matches = nodeMatchesSearch(node)
      const filteredChildren = node.children
        ?.map(child => filterAndMarkNodes(child))
        .filter(child => child !== null)

      if (matches || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...node,
          children: filteredChildren || [],
          open: true
        }
      }

      return null
    }

    const filteredData = {
      ...treeViewData.originalData,
      children: treeViewData.originalData.children
        .map(child => filterAndMarkNodes(child))
        .filter(child => child !== null)
    }

    treeViewData.model = convertToTreeViewFormat(filteredData, true)
  }

  return {
    treeViewData,
    selectedNode,
    updateTreeData,
    selectNode,
    isLeafNode,
    findSingleLeafNode,
    searchInTree
  }
}