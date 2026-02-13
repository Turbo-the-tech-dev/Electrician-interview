export interface Topic {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Curriculum {
  modules: Module[];
}
