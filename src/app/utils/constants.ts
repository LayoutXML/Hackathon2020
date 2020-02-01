export abstract class Constants {
  private static readonly BASE_URL = 'https://blockchain.info/';

  static readonly PARAMS = '?cors=true';

  static readonly BLOCK_HASH_URL = Constants.BASE_URL + 'q/latesthash/';
  static readonly BLOCK_URL = Constants.BASE_URL + 'rawblock/';
}
