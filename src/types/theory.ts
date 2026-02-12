export interface Topic {
  id: string;
  title: string;
  description: string;
  keyConcepts: string[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Curriculum {
  version: string;
  modules: Module[];
}
