<template>
  <div class="upload-container">
    <el-button @click="initializeTree" type="primary"> reset</el-button>
    <div ref="treeData" id="tree" style="width: 1200px; height: 1000px"></div>
    <div
      v-if="showInfoPanel"
      class="node-info-panel"
      :style="{ left: positionXY.left + 'px', top: positionXY.top + 'px' }"
      @click.stop
    >
      <div class="info-header">
        <h3>节点信息</h3>
        <button @click="showInfoPanel = false" class="close-btn">×</button>
      </div>

      <div v-if="selectedNode" class="info-content">
        <div class="info-row">
          <span class="label">名称:</span>
          <span class="value">{{ selectedNode?.data?.name || "无" }}</span>
        </div>

        <div class="info-row">
          <span class="label">分支长度:</span>
          <span class="value">{{ selectedNode?.data?.attribute || "无" }}</span>
        </div>

        <div class="info-row">
          <span class="label">深度:</span>
          <span class="value">{{ selectedNode?.data?.annotation || "无" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import "phylotree/dist/phylotree.css";
import { phylotree as Phylotree } from "phylotree";
const treeData = ref<any>(null);
const selectedNode = ref<any>(null);
const positionXY = reactive({
  left: 200,
  top: 200
});
const showInfoPanel = ref(false);

const handleNodeClick = (node, event) => {
  if (node?.data?.name && selectedNode.value?.data?.name === node?.data?.name) return;
  selectedNode.value = node;
  showInfoPanel.value = true;
  const rect = treeData.value.getBoundingClientRect();
  positionXY.left = event.clientX - rect.x + 48;
  positionXY.top = event.clientY - rect.y;
};
onMounted(() => {
  initializeTree();
});
const list = new Set(["YP_0038120", "ZP_0509506", "ZP_1077782", "YP_433139"]);
function colorNodesByName(element, data) {
  const color = data?.children?.length && data.children.every(child => list.has(child.data.name)) ? "red" : "gray";
  element.selectAll("circle").style("fill", color).style("stroke", color).style("stroke-width", "1px");
}
function colorEdgesByName(element, data) {
  const color = data.target.data.name && list.has(data.target.data.name) ? "red" : "gray";
  element.style("stroke", color).style("stroke-width", "2px");
}
const initializeTree = () => {
  selectedNode.value = null;
  showInfoPanel.value = false;
  const newick = `(((((YP_0038120:0.3990275855,ZP_0509506:0.4708403113)16:0.0827617173,((((YP_0028009:0.0983484613,ABK15514:0.1322882846)100:0.2658296649,ZP_1077782:0.6890206276)54:0.1249721135,ZP_0111387:0.3178024438)33:0.0462544520,((YP_433139:0.3823668263,YP_958213:0.3906268190)69:0.1354198970,ZP_0130727:0.3058092646)36:0.1005193390)18:0.0211735847)22:0.0605114450,(((YP_0030742:0.1830349875,YP_526727:0.1042282207)95:0.1357964298,ZP_1013419:0.3702960354)78:0.0718566437,ZP_0950340:0.3886711834)70:0.1073072978)71:0.1546311852,((ZP_0998998:0.0955996985,ZP_1049308:0.0615438616)99:0.3920705702,(YP_0021568:0.3911667388,((((YP_0029865:0.0841201303,AFB73763:0.0283518412)17:0.0000014632,EHB20458:0.0687641880)59:0.0542412622,ZP_0296170:0.3755247695)92:0.1582934488,YP_0050935:0.3509942991)82:0.1264119120)58:0.0310116086)98:0.2431064013)100:1.1356345531,ZP_1115340:0.1260949059,ZP_0206258:0.1548044869);`;
  const tree = new Phylotree(newick);
  const display = tree.render({
    container: "#tree",
    width: 1200,
    height: 1000,
    "left-right-spacing": "fit-to-size",
    "top-bottom-spacing": "fit-to-size",
    "show-scale": true,
    selectable: true,
    collapsible: true,
    "align-tips": false,
    zoom: true,
    brush: false,
    "label-nodes-with-name": true,
    "internal-names": true,
    "show-menu": false,
    scaling: true,
    node_circle_size: () => 4,
    "node-styler": colorNodesByName,
    "edge-styler": colorEdgesByName,
    "font-size": 14
  });
  display.on("nodeHover", (node, e) => {
    handleNodeClick(node, e);
  });
  // display.on("nodeClick", (node, e) => {
  //   console.log("点击节点:", node);
  // });
  treeData.value.append(display.show());
};
</script>

<style scoped lang="scss">
.upload-container {
  position: relative;
}
.node-info-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  background: white;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  transform: translate(0, -50%);
  .info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-bottom: 1px solid #eeeeee;
    h3 {
      margin: 0;
      color: #333333;
    }
    .close-btn {
      font-size: 24px;
      color: #999999;
      cursor: pointer;
      background: none;
      border: none;
      &:hover {
        color: #333333;
      }
    }
  }
  .info-content {
    padding: 15px;
  }
  .info-row {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    word-break: break-all;
    .label {
      width: 100px;
      font-weight: bold;
      color: #666666;
    }
    .value {
      flex: 1;
      color: #333333;
    }
  }
}
:deep(.phylotree-node-text) {
  cursor: pointer;
}
:deep(.internal-node circle) {
  cursor: pointer;
}
</style>
