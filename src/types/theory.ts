export interface Topic {
  id: string;
  title: string;
  learningObjectives: string[];
  contentOutline: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Curriculum {
  curriculumTitle: string;
  version: string;
  modules: Module[];
}
