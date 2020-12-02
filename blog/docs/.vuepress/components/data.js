const tree2 = [
  {
    name: '1-1-1',
    children: [
      {
        name: '1-1-1-1',
        children: [
          {
            name: 'a-1-3-1',
          },
          {
            name: 'a-1-3-2'
          },  {
            name: 'a-1-3-4',
            type: 'text'
          }
        ]
      },
      {
        name: '1-1-1-2'
      }
    ]
  },
  {
    name: '1-1-2',
    children: [
      {
        name: '1-2-1',
        type: 'text'
      },
      {
        name: '1-2-2',
        type: 'text'
      },
      {
        name: '1-2-3',
        type: 'text'
      },
      {
        name: '1-2-4'
      }
    ]
  },
  
  {
    name: '1-1-3',
    children: [
      {
        name: '1-1-3-1',
        children: [
          {
            name: '1-2-1',
            
          },
          {
            name: 'a-1-3-3',
            children: [
              {
                name: 'a-1-3-1',
                children: [
                  {
                    name: 'a-1-3-1',
                  },
                  {
                    name: 'a-1-3-2'
                  },
                  {
                    name: 'a-1-3-3'
                  },
                  {
                    name: 'a-1-3-4'
                  }
                ]
              },
              {
                name: 'a-1-3-2'
              },
              {
                name: 'a-1-3-3'
              },
              {
                name: 'a-1-3-4'
              }
            ]
          },
          {
            name: '1-2-2'
          },
          {
            name: '1-2-3'
          },
          {
            name: '1-2-4'
          }
        ]
      },
      {
        name: '1-1-3-2'
      }
    ]
  },
  {
    name: '1-1-4',
    children: [
      {
        name: '1-1-3-1',
        children: [
          {
            name: '1-2-1',
            
          },
          {
            name: 'a-1-3-3',
            children: [
              {
                name: 'a-1-3-1',
                children: [
                  {
                    name: 'a-1-3-1',
                  },
                  {
                    name: 'a-1-3-2'
                  },
                  {
                    name: 'a-1-3-3'
                  },
                  {
                    name: 'a-1-3-4'
                  }
                ]
              },
              {
                name: 'a-1-3-2'
              },
              {
                name: 'a-1-3-3'
              },
              {
                name: 'a-1-3-4'
              }
            ]
          },
          {
            name: '1-2-2'
          },
          {
            name: '1-2-3'
          },
          {
            name: '1-2-4'
          }
        ]
      },
      {
        name: '1-1-3-2'
      }
    ]
  }
]
const tree = [
  {
    name: '1',
    type: 'dir',
    children: [
      {
        name: '1-1',
        children: [
          {
            name: '1-1-1',
          },
          {
            name: '1-1-2'
          }
        ]
      },
      {
        name: '1-2',
        children: [
          {
            name: '1-2-1',
          },
          {
            name: '1-2-2'
          },
          {
            name: '1-2-3'
          },
          {
            name: '1-2-4'
          }
        ]
      },
      {
        name: '1-3',
        children: [
          {
            name: '1-3-1',
          },
          {
            name: '1-3-2'
          },
          {
            name: '1-3-3'
          },
          {
            name: '1-3-4'
          }
        ]
      }
    ]
  }
]
const root = {
  name: '前端知识',
  children: [...tree2, ...tree]
}
export const min = {
  name: '3333',
  children: [
    {
      label: 1344,
      children: [
        {
          label: 1344,
          
        },
        {
          label: 3455
        }
      ]
    },
    {
      label: 3455,
    }
  ]
}
export const min2 = {
  name: '3333',
  children: [
    {
      label: 1344,
      children: [
        {
          label: 1344,

        },
        {
          label: 3455
        }
      ]
    },
    {
      label: 3455,
      children: [
        {
          label: 13441,

        },
        {
          label: 34552
        }
      ]
    }
  ]
}