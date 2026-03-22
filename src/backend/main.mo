import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import AccessControl "./authorization/access-control";

actor {
  // ── Migration: preserve old stable state so upgrade succeeds
  stable var accessControlState = AccessControl.initState();

  // ── Types
  public type Category = {
    id : Nat;
    name : Text;
    sortOrder : Nat;
  };

  public type MenuItem = {
    id : Nat;
    categoryId : Nat;
    name : Text;
    description : Text;
    priceCents : Nat;
    available : Bool;
  };

  public type OrderItem = {
    menuItemId : Nat;
    name : Text;
    priceCents : Nat;
    quantity : Nat;
  };

  public type OrderStatus = { #pending; #completed; #voided };

  public type Order = {
    id : Nat;
    orderNumber : Nat;
    customerName : Text;
    customerMobile : Text;
    items : [OrderItem];
    subtotalCents : Nat;
    taxCents : Nat;
    totalCents : Nat;
    status : OrderStatus;
    createdAt : Int;
  };

  public type CreateOrderItemInput = {
    menuItemId : Nat;
    quantity : Nat;
  };

  // ── Stable storage (survives upgrades)
  stable var stableCategories : [Category] = [];
  stable var stableMenuItems : [MenuItem] = [];
  stable var stableOrders : [Order] = [];
  stable var nextCategoryId : Nat = 1;
  stable var nextMenuItemId : Nat = 1;
  stable var nextOrderId : Nat = 1;
  stable var nextOrderNumber : Nat = 1;

  // ── Runtime maps (rebuilt from stable arrays)
  var categories = Map.empty<Nat, Category>();
  var menuItems = Map.empty<Nat, MenuItem>();
  var orders = Map.empty<Nat, Order>();

  // ── Init: load from stable arrays
  for (cat in stableCategories.vals()) {
    categories.add(cat.id, cat);
  };
  for (item in stableMenuItems.vals()) {
    menuItems.add(item.id, item);
  };
  for (order in stableOrders.vals()) {
    orders.add(order.id, order);
  };

  // ── Upgrade hooks
  system func preupgrade() {
    stableCategories := categories.values().toArray();
    stableMenuItems := menuItems.values().toArray();
    stableOrders := orders.values().toArray();
  };

  system func postupgrade() {
    // Runtime maps already populated in actor body init above
  };

  // ── Helper: upsert (remove then add)
  func upsert<V>(m : Map.Map<Nat, V>, id : Nat, val : V) {
    m.remove(id);
    m.add(id, val);
  };

  // ── Categories
  public shared func createCategory(name : Text, sortOrder : Nat) : async Category {
    let cat : Category = { id = nextCategoryId; name; sortOrder };
    categories.add(nextCategoryId, cat);
    nextCategoryId += 1;
    cat;
  };

  public shared func updateCategory(id : Nat, name : Text, sortOrder : Nat) : async ?Category {
    switch (categories.get(id)) {
      case (null) null;
      case (?_) {
        let cat : Category = { id; name; sortOrder };
        upsert(categories, id, cat);
        ?cat;
      };
    };
  };

  public shared func deleteCategory(id : Nat) : async Bool {
    let exists = categories.containsKey(id);
    categories.remove(id);
    exists;
  };

  public query func listCategories() : async [Category] {
    categories.values().toArray().sort(func(a : Category, b : Category) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder);
    });
  };

  // ── Menu Items
  public shared func createMenuItem(categoryId : Nat, name : Text, description : Text, priceCents : Nat) : async MenuItem {
    let item : MenuItem = { id = nextMenuItemId; categoryId; name; description; priceCents; available = true };
    menuItems.add(nextMenuItemId, item);
    nextMenuItemId += 1;
    item;
  };

  public shared func updateMenuItem(id : Nat, categoryId : Nat, name : Text, description : Text, priceCents : Nat, available : Bool) : async ?MenuItem {
    switch (menuItems.get(id)) {
      case (null) null;
      case (?_) {
        let item : MenuItem = { id; categoryId; name; description; priceCents; available };
        upsert(menuItems, id, item);
        ?item;
      };
    };
  };

  public shared func deleteMenuItem(id : Nat) : async Bool {
    let exists = menuItems.containsKey(id);
    menuItems.remove(id);
    exists;
  };

  public query func listMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  public query func listMenuItemsByCategory(categoryId : Nat) : async [MenuItem] {
    menuItems.values().toArray().filter(func(i : MenuItem) : Bool {
      i.categoryId == categoryId and i.available;
    });
  };

  // ── Orders
  public shared func createOrder(customerName : Text, customerMobile : Text, itemInputs : [CreateOrderItemInput]) : async ?Order {
    var orderItems : [OrderItem] = [];
    var subtotal = 0;

    for (input in itemInputs.vals()) {
      switch (menuItems.get(input.menuItemId)) {
        case (null) return null;
        case (?item) {
          let oi : OrderItem = {
            menuItemId = item.id;
            name = item.name;
            priceCents = item.priceCents;
            quantity = input.quantity;
          };
          orderItems := orderItems.concat([oi]);
          subtotal += item.priceCents * input.quantity;
        };
      };
    };

    let taxCents = subtotal * 5 / 100;
    let totalCents = subtotal + taxCents;
    let order : Order = {
      id = nextOrderId;
      orderNumber = nextOrderNumber;
      customerName;
      customerMobile;
      items = orderItems;
      subtotalCents = subtotal;
      taxCents;
      totalCents;
      status = #pending;
      createdAt = Time.now();
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    nextOrderNumber += 1;
    ?order;
  };

  public query func getOrder(id : Nat) : async ?Order {
    orders.get(id);
  };

  public shared func updateOrderStatus(id : Nat, status : OrderStatus) : async ?Order {
    switch (orders.get(id)) {
      case (null) null;
      case (?o) {
        let updated : Order = {
          id = o.id;
          orderNumber = o.orderNumber;
          customerName = o.customerName;
          customerMobile = o.customerMobile;
          items = o.items;
          subtotalCents = o.subtotalCents;
          taxCents = o.taxCents;
          totalCents = o.totalCents;
          status;
          createdAt = o.createdAt;
        };
        upsert(orders, id, updated);
        ?updated;
      };
    };
  };

  public query func listRecentOrders(limit : Nat) : async [Order] {
    let all = orders.values().toArray().sort(
      func(a : Order, b : Order) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal;
      }
    );
    if (limit == 0 or limit >= all.size()) all
    else all.sliceToArray(0, limit);
  };
};
