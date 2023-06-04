// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.7;

// library LinkedList {
//   struct Node {
//     uint256 data;
//     uint256 next;
//   }

//   struct LinkedList {
//     mapping(uint256 => Node) list;
//     uint256 head;
//     uint256 tail;
//   }

//   function enqueue(LinkedList storage self,uint256 data) public {
//     Node memory newNode = Node(data,0);
//     if(self.head ==0){
//       self.head = 1;
//       self.tail = 1;
//       self.list[1] = newNode;
//     }else{
//       self.list[self.tail].next = self.tail+1;
//       self.tail +=1;
//       self.list[self.tail] = newNode;
//     }
//   }

//   function dequeue(LinkedList storage self) public returns(uint256){
//     require(self.head !=0,"Linked list is empty");
//     uin256 data = self.list[self.head].data;
//     delete
//   }
// }