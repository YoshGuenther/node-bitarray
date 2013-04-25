'use strict';

var assert = require('assert')
  , ase = assert.strictEqual
  , ade = assert.deepEqual
  , BitArray = require('./index')

describe('BitArray', function() {

  describe('Static methods', function() {

    it('#factory()', function() {
      var a = [255, 128].map(BitArray.factory).map(String)
      ase(a[0], '11111111')
      ase(a[1], '00000001')
    })

    it('#push()', function() {
      var bits = new BitArray()
      bits.push(1)
      bits.push(0)
      bits.push(1)
      ase(bits.pop(), 1)
      ase(bits.pop(), 0)
    })

    it('#bitcount()', function() {
      ase(BitArray.cardinality(144), 2)
      ase(BitArray.count(128), 1)
      ase(BitArray.bitcount(new Buffer([255, 128])), 9)
      ase(BitArray.population([0,1,1,0,1,0]), 3)
    })

    it('#octet()', function() {
      var oct = BitArray.octet([])
      ase(oct.length, 8)
      oct.push(1)
      var oct2 = BitArray.octet(oct)
      ase(oct2.length, 16)
    })

    it('#parse()', function() {
      ade(BitArray.parse('100101'), [1,0,1,0,0,1])
      ase(new BitArray(new BitArray(128).toString()).toString(), '00000001')
    })

    it('#fromOffsets()', function() {
      var offs = [1, 5, 10]
        , ba = BitArray.fromOffsets(offs)
      ase(ba.length, 11)
      ase(ba.toString(), '10000100010')
    })

    it('#fromNumber()', function() {
      var bits = BitArray.fromDecimal(12)
      ase(bits.length, 4)
      ase(bits.toString(), (12).toString(2))
      ade(bits.toJSON(), [0, 0, 1, 1])
      var bits = BitArray.fromNumber(15)
      ade(bits.toJSON(), [1,1,1,1])
    })

    it('#fromHex()', function() {
      var bits = BitArray.fromHex('f0')
      ase(bits.toString(), '11110000')
      var bits = BitArray.fromHex(10)
      ase(bits.toString(), '10000')
      var bits = BitArray.fromHex('Fa')
      ade(bits.toJSON(), [0, 1, 0, 1, 1, 1, 1, 1])
    })

    it('#fromBuffer()', function() {
      var buf = new Buffer([128, 144, 255])
      , bits = BitArray.fromBuffer(buf)
      ade(bits.toJSON(), [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1])
    })

    it('#from32Integer()', function() {
      var bits = BitArray.from32Integer(144)
      ade(bits.toJSON(), [1,0,0,1,0,0,0,0])
      bits.set()
    })

    it('#toOffsets()', function() {
      var offs = BitArray.toOffsets([1, 0, 0, 1])
      ade(offs, [0, 3])
    })

    it('#toNumber()', function() {
      ase(BitArray.toNumber([1, 0, 1, 1, 0, 1]), 45)
    })
    
    it('#toHex()', function() {
      ase(BitArray.toHex([1, 0, 1, 1, 0, 1]), '2d')
    })

    it('#toBuffer()', function() {
      var buf = BitArray.toBuffer([1,1,1,1,1,1,1,1])
      ase(buf instanceof Buffer, true)
      ase(buf[0], 255)
    })

    it('#xor()', function() {
      var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
      var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
      var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
      var d = BitArray.xor(a, b, c)
      ade(d,  [ 0, 1, 0, 1, 1, 1, 0, 1 ])
    })

    it('#or()', function() {
      var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
      var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
      var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
      var d = BitArray.or(a, b, c)
      ade(d,  [ 1, 1, 0, 1, 1, 1, 0, 1 ])
    })

    it('#and()', function() {
      var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
      var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
      var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
      var d = BitArray.and(a, b, c)
      ade(d,  [ 0, 0, 0, 0, 0, 0, 0, 1 ])
    })

    it('#not()', function() {
      var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
      var b = BitArray.not(a)
      ade(b,  [ 0, 1, 1, 0, 1, 1, 1, 0])
    })
  })

  describe('Instance methods', function() {

    it('#bitcount()', function() {
      var bits = new BitArray()
      bits.set(0, 1)
      bits.set(3, 0)
      bits.set(200, 1)
      ase(bits.cardinality(), 2)
    })

    it('#clear()', function() {
      var bits = new BitArray(255)
      ase(bits.length, 8)
      bits.clear()
      ase(bits.length, 0)

      var bits = new BitArray(0, 10)
      bits.set(4, 1)
      ase(bits.length, 10)
      bits.reset()
      ase(bits.length, 10)
    })

    it('#equals()', function() {
      var a = new BitArray(1)
        , b = new BitArray(2)
        , c = new BitArray().set(0, 1)

      ase(a.equals(b), false)
      ase(a.equals(c), true)
    })

    it('#get()', function() {
      var bits = new BitArray(144)
      ase(bits.get(0), 1)
      ase(bits.get(1), 0)
      ase(bits.get(3), 1)
    })

    it('#set()', function() {
      var bits = new BitArray()
      bits.set(0, 1)
      ase(bits.get(0), 1)
      bits.set(7, 1)
      ase(bits.get(6), 0)
      ase(bits.get(7), 1)
      ade(bits.toJSON(), [1,0,0,0,0,0,0,1])
      ase(bits.length, 8)
    })

    it('#fill()', function() {
      var bits = new BitArray()
      bits.fill(24)
      ase(bits.length, 24)
    })

    it('#valueOf()', function() {
      var bits = new BitArray('1001')
      ase(+bits, 9)
      ase(new BitArray('011001') + new BitArray(new Buffer([255])), 280)

      var bits = new BitArray().set([1, 0, 1, 1])
      ase(bits.toNumber(), 13)
    })

    it('#toString()', function() {
      var bit = new BitArray(new Buffer([128, 144]))
      ase(bit.toString(), '0000100100000001')
      var bit2 = new BitArray(255)
      ase([bit2].join(''), '11111111')
      var bits = new BitArray('0011')
      ase([bits].join(''), '0011')
    })

    it('#toHex()', function() {
      var bits = new BitArray(255)
      ase(bits.toHex(), 'ff')

      var bits = new BitArray().set([1, 0, 1, 1])
      ase(bits.toHex(), 'd')
    })

    it('#toOffsets()', function() {
      var bits = new BitArray(144)
      ade(bits.toOffsets(), [0, 3])
    })

    it('#toJSON()', function() {
      var bit = new BitArray(new Buffer([128, 144]))
      ade(bit.toJSON(), [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0])
      ase(JSON.stringify(bit), '[1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0]')
      var bit2 = new BitArray(255)
      ade(bit2.toArray(), [1,1,1,1,1,1,1,1])
    })

    it('#length', function() {
      var bits = new BitArray(0, 16)
      ase(bits.__bits[15], 0)
      ase(bits.length, 16)
      ase(bits.toString().length, 16)
      ase(bits.reset().length, 16)
    })
  })
})
