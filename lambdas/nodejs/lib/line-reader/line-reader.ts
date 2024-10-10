export interface LineReader {
  readLine(): Promise<string | undefined>;
  close(): Promise<void>;
}
