// tslint:disable

import * as assert from 'assert'

import generateCategoriesTree from './generateCategoriesTree'

const CATEGORIES_TEST: any = [
  {
    _id: 'b',
    name: 'B',
    slug: 'b',
    position: 1,
  },
  {
    _id: 'a',
    name: 'A',
    slug: 'a',
    position: 0,
  },
  {
    _id: 'ba',
    parent: 'b',
    name: 'BA',
    slug: 'ba',
    position: 0,
  },
  {
    _id: 'bb',
    parent: 'b',
    name: 'BB',
    slug: 'bb',
    position: 0,
  },
  {
    _id: 'aaa',
    parent: 'aa',
    name: 'AAA',
    slug: 'aaa',
    position: 0,
  },
  {
    _id: 'aa',
    parent: 'a',
    name: 'AA',
    slug: 'aa',
    position: 0,
  },
  {
    _id: 'c',
    name: 'C',
    slug: 'c',
    position: 2,
  },
]

const CATEGORIES_TREE_TEST: any = [
  {
    id: 'a',
    parent: undefined,
    name: 'A',
    slug: 'a',
    position: 0,
    depth: 0,
    children: [
      {
        id: 'aa',
        parent: 'a',
        name: 'AA',
        slug: 'aa',
        position: 0,
        depth: 1,
        children: [
          {
            id: 'aaa',
            parent: 'aa',
            name: 'AAA',
            slug: 'aaa',
            position: 0,
            depth: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'b',
    parent: undefined,
    name: 'B',
    slug: 'b',
    position: 1,
    depth: 0,
    children: [
      {
        id: 'ba',
        parent: 'b',
        name: 'BA',
        slug: 'ba',
        position: 0,
        depth: 1,
        children: [],
      },
      {
        id: 'bb',
        parent: 'b',
        name: 'BB',
        slug: 'bb',
        position: 0,
        depth: 1,
        children: [],
      },
    ],
  },
  {
    id: 'c',
    parent: undefined,
    name: 'C',
    slug: 'c',
    position: 2,
    depth: 0,
    children: [],
  },
]

describe('helpers/generateCategoriesTree()', function() {
  it(`SHOULD return the expected result`, function() {
    assert.deepEqual(generateCategoriesTree(CATEGORIES_TEST), CATEGORIES_TREE_TEST)
  })
})
