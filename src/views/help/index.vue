<template>
  <div class="help-container">
    <!-- 帮助中心标题 -->
    <div class="header">
      <h1>Help Center</h1>
      <img src="@/assets/images/question.png" class="header-image" width="" />
      <p>"You can find answers to common questions in the Help Center."</p>
    </div>

    <!-- 导航标签页 -->
    <div class="tabs">
      <el-tabs v-model="activeTab" type="card" class="centered-tabs">
        <el-tab-pane label="Glossary" name="glossary">
          <div class="glossary-content">
            <h2 style="margin-bottom: 20px; color: #d32f2f">
              <i>Salmonella</i> Visualization Web Page Terminology Interpretation
            </h2>
            <el-table :data="terminologyList" border style="width: 80%">
              <el-table-column prop="noun" label="NOUN" width="300">
                <template #default="{ row }">
                  <span>{{ row.noun }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Description" width="800">
                <template #default="{ row }">
                  <div class="description">
                    {{ row.description }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="QA" name="qa">
          <div class="qa-content">
            <p>FAQ section will be implemented here.</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="cite" name="cite">
          <div class="cite-content">
            <p>Citation information will be displayed here.</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 当前激活的标签页
const activeTab = ref("glossary");

// 术语列表数据
const terminologyList = ref([
  {
    noun: "Serovar/Serotype",
    explain: "Explain",
    description:
      "A serovar or serotype is a strain of bacteria that can be distinguished by its surface antigens, such as O and H antigens in Salmonella.",
    showDesc: false
  },
  {
    noun: "MLST, Multilocus Sequence Typing",
    explain: "Explain",
    description:
      "MLST is a method for characterizing bacterial strains based on the DNA sequences of multiple housekeeping genes.",
    showDesc: false
  },
  {
    noun: "WgMLST, Whole Genome MLST",
    explain: "Explain",
    description:
      "WgMLST extends MLST to include hundreds or thousands of loci across the entire genome, providing higher resolution for strain differentiation.",
    showDesc: false
  },
  {
    noun: "DcgMLST",
    explain: "Explain",
    description:
      "DcgMLST (Distributed Core Genome MLST) is a variant of WgMLST that focuses on core genomic regions shared among closely related strains.",
    showDesc: false
  },
  {
    noun: "Virulence Factors, VFs",
    explain: "Explain",
    description:
      "Genes or proteins that contribute to the ability of a pathogen to cause disease, such as toxins, adhesins, and invasion factors.",
    showDesc: false
  },
  {
    noun: "ARGs, Antibiotic Resistance Genes",
    explain: "Explain",
    description: "Genes that confer resistance to antibiotics, allowing bacteria to survive exposure to antimicrobial agents.",
    showDesc: false
  },
  {
    noun: "Phylogenetic Tree",
    explain: "Explain",
    description: "A diagram showing the evolutionary relationships among organisms or genes based on genetic sequence data.",
    showDesc: false
  },
  {
    noun: "Single Nucleotide Polymorphism Matrix",
    explain: "Explain",
    description:
      "A matrix representing differences at single nucleotide positions across multiple genomes, used for population genetics analysis.",
    showDesc: false
  },
  {
    noun: "Plasmid",
    explain: "Explain",
    description:
      "A small, circular DNA molecule separate from chromosomal DNA, often carrying genes for antibiotic resistance or virulence.",
    showDesc: false
  },
  {
    noun: "Host Adaptation",
    explain: "Explain",
    description: "The process by which a pathogen evolves to better survive and replicate within a specific host species.",
    showDesc: false
  },
  {
    noun: "LPS, Lipopolysaccharide",
    explain: "Explain",
    description:
      "A major component of the outer membrane of Gram-negative bacteria, including Salmonella, which triggers strong immune responses.",
    showDesc: false
  },
  {
    noun: "Typhoid Fever",
    explain: "Explain",
    description:
      "A systemic infection caused by Salmonella enterica serovar Typhi, characterized by high fever, headache, and gastrointestinal symptoms.",
    showDesc: false
  }
]);

// 显示解释
</script>

<style scoped lang="scss">
@import "./index";
</style>
