export type ProjectSubModule = {
  _id: string;
  name: string;
  repository: Repository;
};

export type Repository = {
  backend: RepositoryItem[];
  frontend: RepositoryItem[];
  mobile: RepositoryItem[];
};
export type RepositoryItem = {
  _id: string;
  name: string;
};
