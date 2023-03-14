class FriendList {
  friends = [];

  addFriends(name) {
    this.friends.push(name);
  }
}

describe("added friends", () => {
  it("add friend",() => {
    const friendList = new FriendList();
    expect(friendList.friends.length).toEqual(1);
  });
});
