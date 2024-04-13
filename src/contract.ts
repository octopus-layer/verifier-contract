// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, LookupMap, LookupSet, initialize } from 'near-sdk-js'
import { assert } from './utils'

@NearBindgen({})
class VerifierContract {
  zkp_signature: string = "";
  nodes =  new LookupSet<string>('');
  node_count: number = 0;
  //zkp_list =  new LookupMap<string>( "zkp_list");
  zkp_list = LookupMap<string>;

  @call({}) 
  deployContract(zkp_signature: string, nodes): void {
    this.zkp_signature = zkp_signature;
    this.nodes = nodes;
  }

  @call({})
  hashFunction(data: string): Uint8Array{
    const dataBytes =  new TextEncoder().encode(data);
    return near.sha256(dataBytes);
  }

  @call({})
  addNode(newpubkey: string, signatures: [{
    pubkey: string,
    signature: string
  }]): void{
     if (signatures.length < 0.66 * this.node_count){
        assert(false, "Not enough signatures")
     }

     for (const { pubkey, signature } of signatures){
        if (this.nodes.contains(pubkey)){
          assert(false, "Node already exists")
        }
        
     }

  }

  @call({})
  settle_proof(proof: string, signatures: [{ pubkey: string, signature: string }]): void{
      if (signatures.length < 0.66 * this.node_count){
        assert(false, "Not enough signatures")
      }
      for (const { pubkey, signature } of signatures){
        if (!this.nodes.contains(pubkey)){
          assert(false, "Node does not exist")
        }
     
      }
    }

  }
}