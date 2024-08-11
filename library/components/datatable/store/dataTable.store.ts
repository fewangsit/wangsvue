import { reactive } from 'vue';

export interface DataTableStore {
  /**
   * Get the config object from the store.
   */
  config: DataTableConfig;
  /**
   * Update config for specific Table.
   *
   * @param id The table ID
   * @param columnsConfig The columns configuration
   */
  setConfig: (
    id: string,
    columnsConfig: DataTableColumnConfig[],
  ) => Promise<void>;
}

export type DataTableConfig = Record<string, DataTableColumnConfig[]>;

export interface DataTableColumnConfig {
  field: string;
  width: number | string;
  fixed: boolean;
  visible: boolean;
}

const STORE_NAME = 'tableConfigs';

const getDBName = (): string => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  return 'user-' + (user._id ?? 'unknown');
};

const openDatabase = async (): Promise<IDBDatabase> => {
  let db: IDBDatabase | null = null; // Variable to store the opened database

  return new Promise((resolve) => {
    const request = indexedDB.open(getDBName(), 1); // Open the database

    request.onupgradeneeded = (event): void => {
      db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(STORE_NAME); // Create the object store
    };

    request.onsuccess = (event): void => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
  });
};

const getConfig = async (): Promise<DataTableConfig> => {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve) => {
    let keys: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let values: any;

    store.getAllKeys().onsuccess = (event): void => {
      keys = (event.target as IDBRequest).result;
    };

    store.getAll().onsuccess = (e): void => {
      values = (e.target as IDBRequest).result;

      const config: DataTableConfig = {};

      keys.forEach((key, index) => {
        config[key] = values[index];
      });

      resolve(config);
    };
  });
};

const config = reactive<DataTableConfig>({});

const useDataTableStore = async (): Promise<DataTableStore> => {
  const setConfig = async (
    id: string,
    columnsConfig: DataTableColumnConfig[],
  ): Promise<void> => {
    config[id] = columnsConfig;
    const db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(columnsConfig, id);
  };

  Object.assign(config, await getConfig());

  return {
    config,
    setConfig,
  };
};

export default useDataTableStore;
