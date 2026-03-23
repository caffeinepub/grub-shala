import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import AccessControl "./authorization/access-control";

actor {
  var accessControlState = AccessControl.initState();

  public type Category = { id : Nat; name : Text; sortOrder : Nat };
  public type MenuItem = { id : Nat; categoryId : Nat; name : Text; description : Text; priceCents : Nat; available : Bool };
  public type OrderItem = { menuItemId : Nat; name : Text; priceCents : Nat; quantity : Nat };
  public type OrderStatus = { #pending; #completed; #voided };
  public type Order = { id : Nat; orderNumber : Nat; customerName : Text; customerMobile : Text; items : [OrderItem]; subtotalCents : Nat; taxCents : Nat; totalCents : Nat; status : OrderStatus; createdAt : Int };
  public type CreateOrderItemInput = { menuItemId : Nat; quantity : Nat };
  public type Outlet = { id : Nat; name : Text; address : Text };

  var stableCategories : [Category] = [];
  var stableMenuItems : [MenuItem] = [];
  var stableOrders : [Order] = [];
  var stableOutlets : [Outlet] = [];

  // Counters declared stable so they survive upgrades and never reset
  stable var nextCategoryId : Nat = 1;
  stable var nextMenuItemId : Nat = 1;
  stable var nextOrderId : Nat = 1;
  stable var nextOrderNumber : Nat = 1;
  stable var nextOutletId : Nat = 1;

  var categories = Map.empty<Nat, Category>();
  var menuItems = Map.empty<Nat, MenuItem>();
  var orders = Map.empty<Nat, Order>();
  var outlets = Map.empty<Nat, Outlet>();

  // Safe upsert: remove (returns ()) then add
  func upsertCategory(id : Nat, v : Category) { categories.remove(id); categories.add(id, v) };
  func upsertMenuItem(id : Nat, v : MenuItem) { menuItems.remove(id); menuItems.add(id, v) };
  func upsertOrder(id : Nat, v : Order) { orders.remove(id); orders.add(id, v) };
  func upsertOutlet(id : Nat, v : Outlet) { outlets.remove(id); outlets.add(id, v) };

  for (cat in stableCategories.vals()) { upsertCategory(cat.id, cat) };
  for (item in stableMenuItems.vals()) { upsertMenuItem(item.id, item) };
  for (order in stableOrders.vals()) { upsertOrder(order.id, order) };
  for (outlet in stableOutlets.vals()) { upsertOutlet(outlet.id, outlet) };

  // Seed default outlets only on first-time initialization
  if (stableOutlets.size() == 0) {
    upsertOutlet(1, { id = 1; name = "Grub Shala - Energizer"; address = "" });
    upsertOutlet(2, { id = 2; name = "Grub Shala - Sector 73"; address = "" });
    if (nextOutletId < 3) nextOutletId := 3;
  };

  system func preupgrade() {
    stableCategories := categories.values().toArray();
    stableMenuItems := menuItems.values().toArray();
    stableOrders := orders.values().toArray();
    stableOutlets := outlets.values().toArray();
  };

  system func postupgrade() {
    for (cat in stableCategories.vals()) { upsertCategory(cat.id, cat) };
    for (item in stableMenuItems.vals()) { upsertMenuItem(item.id, item) };
    for (order in stableOrders.vals()) { upsertOrder(order.id, order) };
    for (outlet in stableOutlets.vals()) { upsertOutlet(outlet.id, outlet) };
    if (stableOutlets.size() == 0) {
      upsertOutlet(1, { id = 1; name = "Grub Shala - Energizer"; address = "" });
      upsertOutlet(2, { id = 2; name = "Grub Shala - Sector 73"; address = "" });
      if (nextOutletId < 3) nextOutletId := 3;
    };
  };

  public shared(msg) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    AccessControl.initialize(accessControlState, msg.caller, userSecret, userSecret);
  };
  public shared(msg) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, msg.caller);
  };
  public shared(msg) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, msg.caller, user, role);
  };
  public shared(msg) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, msg.caller);
  };

  public shared func createOutlet(name : Text, address : Text) : async Outlet {
    let id = nextOutletId;
    nextOutletId += 1;
    let outlet : Outlet = { id; name; address };
    upsertOutlet(id, outlet);
    outlet;
  };
  public shared func updateOutlet(id : Nat, name : Text, address : Text) : async ?Outlet {
    switch (outlets.get(id)) {
      case (null) null;
      case (?_) { let o : Outlet = { id; name; address }; upsertOutlet(id, o); ?o };
    };
  };
  public shared func deleteOutlet(id : Nat) : async Bool {
    let exists = outlets.containsKey(id);
    outlets.remove(id);
    exists;
  };
  public query func listOutlets() : async [Outlet] {
    outlets.values().toArray().sort(func(a : Outlet, b : Outlet) : { #less; #equal; #greater } { Nat.compare(a.id, b.id) });
  };

  public shared func createCategory(name : Text, sortOrder : Nat) : async Category {
    let id = nextCategoryId;
    nextCategoryId += 1;
    let cat : Category = { id; name; sortOrder };
    upsertCategory(id, cat);
    cat;
  };
  public shared func updateCategory(id : Nat, name : Text, sortOrder : Nat) : async ?Category {
    switch (categories.get(id)) {
      case (null) null;
      case (?_) { let c : Category = { id; name; sortOrder }; upsertCategory(id, c); ?c };
    };
  };
  public shared func deleteCategory(id : Nat) : async Bool {
    let exists = categories.containsKey(id);
    categories.remove(id);
    exists;
  };
  public query func listCategories() : async [Category] {
    categories.values().toArray().sort(func(a : Category, b : Category) : { #less; #equal; #greater } { Nat.compare(a.sortOrder, b.sortOrder) });
  };

  public shared func createMenuItem(categoryId : Nat, name : Text, description : Text, priceCents : Nat) : async MenuItem {
    let id = nextMenuItemId;
    nextMenuItemId += 1;
    let item : MenuItem = { id; categoryId; name; description; priceCents; available = true };
    upsertMenuItem(id, item);
    item;
  };
  public shared func updateMenuItem(id : Nat, categoryId : Nat, name : Text, description : Text, priceCents : Nat, available : Bool) : async ?MenuItem {
    switch (menuItems.get(id)) {
      case (null) null;
      case (?_) { let i : MenuItem = { id; categoryId; name; description; priceCents; available }; upsertMenuItem(id, i); ?i };
    };
  };
  public shared func deleteMenuItem(id : Nat) : async Bool {
    let exists = menuItems.containsKey(id);
    menuItems.remove(id);
    exists;
  };
  public query func listMenuItems() : async [MenuItem] { menuItems.values().toArray() };
  public query func listMenuItemsByCategory(categoryId : Nat) : async [MenuItem] {
    menuItems.values().toArray().filter(func(i : MenuItem) : Bool { i.categoryId == categoryId and i.available });
  };

  public shared func createOrder(customerName : Text, customerMobile : Text, itemInputs : [CreateOrderItemInput], taxEnabled : Bool) : async ?Order {
    var orderItems : [OrderItem] = [];
    var subtotal = 0;
    for (input in itemInputs.vals()) {
      switch (menuItems.get(input.menuItemId)) {
        case (null) return null;
        case (?item) {
          let oi : OrderItem = { menuItemId = item.id; name = item.name; priceCents = item.priceCents; quantity = input.quantity };
          orderItems := orderItems.concat([oi]);
          subtotal += item.priceCents * input.quantity;
        };
      };
    };
    let taxCents = if (taxEnabled) subtotal * 5 / 100 else 0;
    let totalCents = subtotal + taxCents;
    let id = nextOrderId;
    nextOrderId += 1;
    nextOrderNumber += 1;
    let order : Order = { id; orderNumber = nextOrderNumber - 1; customerName; customerMobile; items = orderItems; subtotalCents = subtotal; taxCents; totalCents; status = #pending; createdAt = Time.now() };
    upsertOrder(id, order);
    ?order;
  };
  public query func getOrder(id : Nat) : async ?Order { orders.get(id) };
  public shared func updateOrderStatus(id : Nat, status : OrderStatus) : async ?Order {
    switch (orders.get(id)) {
      case (null) null;
      case (?o) {
        let updated : Order = { id = o.id; orderNumber = o.orderNumber; customerName = o.customerName; customerMobile = o.customerMobile; items = o.items; subtotalCents = o.subtotalCents; taxCents = o.taxCents; totalCents = o.totalCents; status; createdAt = o.createdAt };
        upsertOrder(id, updated);
        ?updated;
      };
    };
  };
  public shared func deleteOrder(id : Nat) : async Bool {
    let exists = orders.containsKey(id);
    orders.remove(id);
    exists;
  };
  public query func listRecentOrders(limit : Nat) : async [Order] {
    let all = orders.values().toArray().sort(func(a : Order, b : Order) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less else if (a.createdAt < b.createdAt) #greater else #equal;
    });
    if (limit == 0 or limit >= all.size()) all else all.sliceToArray(0, limit);
  };
};
