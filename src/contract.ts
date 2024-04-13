import {
  NearBindgen,
  call,
  view,
  LookupSet,
  UnorderedMap
} from 'near-sdk-js';


@NearBindgen({})
class VerifierContract {
  node_keys = new LookupSet<string>('');
  node_urls = new UnorderedMap<string>('');
  node_count: number = 0;

  @call({})
  deployContract(
    node_keys: string[], // Initial set of node public keys
    node_urls: string[] // Initial set of node URLs
  ): void {
    if (node_keys.length != node_urls.length)
      throw Error('Error: Node keys and URLs do not match.');

    const urls = [];
    
    for (let i = 0; i < node_keys.length; i++)
        urls[node_keys[i]] = node_urls[i];

    this.node_keys.extend(node_keys);
    this.node_urls.extend(urls);
    this.node_count = node_keys.length;
  };

  @call({})
  updateURL(
    public_key: string,
    new_url: string,
    signature: string
  ): void {
    if (!this.node_keys.contains(public_key))
      throw Error('Error: Node does not exist.');

    // TO DO: signature verification

    this.node_urls.set(public_key, new_url);
  };

  @call({})
  addNode(
    public_key: string,
    url: string,
    signatures: [{
      public_key: string;
      signature: string;
    }]
  ): void {
    if (this.node_keys.contains(public_key))
      throw Error('Error: Node already exists.');

    if (signatures.length < 0.66 * this.node_count)
      throw Error('Error: Not enough signatures.');

    for (const { public_key, signature } of signatures) {
      if (!this.node_keys.contains(public_key))
        throw Error('Error: Signature is not valid.');

      // TO DO: signature verification
    }

    this.node_keys.set(public_key);
    this.node_urls.set(public_key, url);
  }
}
