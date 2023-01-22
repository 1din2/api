export default interface SearchService {
  init(): Promise<void>;
  reset(): Promise<void>;
}
