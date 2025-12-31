export default function shardKey(ip: string, numShards: number = 3): number {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = (hash << 5) - hash + ip.charCodeAt(i);
    hash |= 0; // 32-bit integer
  }
  return Math.abs(hash) % numShards;
}

const NUM_SHARDS = 3; // number of DOs
