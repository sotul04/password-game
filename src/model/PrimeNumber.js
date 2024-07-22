class BitSet {
    constructor(size) {
        this.size = size;
        this.words = new Uint32Array(Math.ceil(size / 32));
    }

    set(bitIndex, value) {
        const wordIndex = Math.floor(bitIndex / 32);
        const bitPosition = bitIndex % 32;
        if (value) {
            this.words[wordIndex] |= (1 << bitPosition);
        } else {
            this.words[wordIndex] &= ~(1 << bitPosition);
        }
    }

    get(bitIndex) {
        const wordIndex = Math.floor(bitIndex / 32);
        const bitPosition = bitIndex % 32;
        return (this.words[wordIndex] & (1 << bitPosition)) !== 0;
    }
}

function sieveOfEratosthenes(limit) {
    const bitSet = new BitSet(limit + 1);
    bitSet.set(0, false); 
    bitSet.set(1, false); 

    for (let i = 2; i <= limit; i++) {
        bitSet.set(i, true);
    }

    for (let p = 2; p * p <= limit; p++) {
        if (bitSet.get(p)) {
            for (let multiple = p * p; multiple <= limit; multiple += p) {
                bitSet.set(multiple, false);
            }
        }
    }

    return bitSet;
}


const limit = 1000000;
const PRIME_SET = sieveOfEratosthenes(limit);

export default PRIME_SET;
