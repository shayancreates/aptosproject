module supply_chain::supply_chain {
    use std::signer;
    use std::string::{String, utf8, length};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::table::{Self, Table};

    // Error codes
    const ENOT_INITIALIZED: u64 = 1;
    const EBATCH_NOT_FOUND: u64 = 2;
    const EINSUFFICIENT_BALANCE: u64 = 3;
    const ENOT_OWNER: u64 = 4;
    const EBATCH_EXISTS: u64 = 5;
    const EINVALID_STATUS: u64 = 6;
    const EINVALID_QUANTITY: u64 = 7;
    const ENOT_APPROVED: u64 = 8;
    const EFEEDBACK_EXISTS: u64 = 9;
    const EORDER_NOT_FOUND: u64 = 10;
    const EORDER_NOT_DELIVERED: u64 = 11;
    const EINVALID_RATING: u64 = 12;
    const EINVALID_PHONE: u64 = 13;

    // Batch statuses
    const STATUS_PENDING: vector<u8> = b"pending";
    const STATUS_APPROVED: vector<u8> = b"approved";
    const STATUS_IN_TRANSIT: vector<u8> = b"in_transit";
    const STATUS_DELIVERED: vector<u8> = b"delivered";

    // Struct representing a product batch
    struct ProductBatch has store, key, copy, drop {
        id: u64,
        owner: address,
        product_name: String,
        product_type: String,
        quantity: u64,
        manufacturing_date: u64,
        origin_location: String,
        destination: String,
        current_location: String,
        status: String,
        tags: vector<String>,
        documents: vector<String>,
        created_at: u64,
        updated_at: u64,
        approved_by: address,
        is_active: bool,
        phone_notifications: String
    }

    // Struct for order information
    struct Order has store, key, copy, drop {
        order_id: u64,
        batch_id: u64,
        buyer: address,
        quantity: u64,
        order_date: u64,
        delivery_date: u64,
        status: String,
        is_delivered: bool
    }

    // Struct for feedback
    struct Feedback has store, key, copy, drop {
        feedback_id: u64,
        batch_id: u64,
        order_id: u64,
        buyer: address,
        rating: u8,
        tags: vector<String>,
        comments: String,
        created_at: u64
    }

    // Struct for supply chain events
    struct BatchEvent has store, drop, copy {
        batch_id: u64,
        event_type: String,
        location: String,
        timestamp: u64,
        notes: String
    }

    // Main supply chain collection
    struct SupplyChain has key {
        batches: Table<u64, ProductBatch>,
        next_batch_id: u64,
        orders: Table<u64, Order>,
        next_order_id: u64,
        feedbacks: Table<u64, Feedback>,
        next_feedback_id: u64,
        events: Table<u64, BatchEvent>,
        next_event_id: u64,
        batch_created_events: event::EventHandle<BatchCreatedEvent>,
        batch_approved_events: event::EventHandle<BatchApprovedEvent>,
        batch_status_events: event::EventHandle<BatchStatusEvent>,
        order_created_events: event::EventHandle<OrderCreatedEvent>,
        order_delivered_events: event::EventHandle<OrderDeliveredEvent>,
        feedback_events: event::EventHandle<FeedbackEvent>
    }

    // Event structs
    struct BatchCreatedEvent has drop, store {
        batch_id: u64,
        owner: address,
        product_name: String,
        quantity: u64,
        created_at: u64
    }

    struct BatchApprovedEvent has drop, store {
        batch_id: u64,
        approved_by: address,
        approved_at: u64
    }

    struct BatchStatusEvent has drop, store {
        batch_id: u64,
        old_status: String,
        new_status: String,
        updated_at: u64
    }

    struct OrderCreatedEvent has drop, store {
        order_id: u64,
        batch_id: u64,
        buyer: address,
        quantity: u64,
        order_date: u64
    }

    struct OrderDeliveredEvent has drop, store {
        order_id: u64,
        delivery_date: u64
    }

    struct FeedbackEvent has drop, store {
        feedback_id: u64,
        batch_id: u64,
        order_id: u64,
        buyer: address,
        rating: u8,
        created_at: u64
    }

    // Initialize the supply chain collection
    public entry fun initialize_supply_chain(account: &signer) {
        let account_addr = signer::address_of(account);
        if (!exists<SupplyChain>(account_addr)) {
            let supply_chain = SupplyChain {
                batches: table::new(),
                next_batch_id: 1,
                orders: table::new(),
                next_order_id: 1,
                feedbacks: table::new(),
                next_feedback_id: 1,
                events: table::new(),
                next_event_id: 1,
                batch_created_events: account::new_event_handle(account),
                batch_approved_events: account::new_event_handle(account),
                batch_status_events: account::new_event_handle(account),
                order_created_events: account::new_event_handle(account),
                order_delivered_events: account::new_event_handle(account),
                feedback_events: account::new_event_handle(account)
            };
            move_to(account, supply_chain);
        };
    }

    // Add phone notification to batch
    public entry fun add_phone_notification(
        owner: &signer,
        batch_id: u64,
        phone_number: String
    ) acquires SupplyChain {
        let owner_addr = signer::address_of(owner);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.batches, batch_id), EBATCH_NOT_FOUND);

        let batch = table::borrow_mut(&mut supply_chain.batches, batch_id);
        assert!(batch.owner == owner_addr, ENOT_OWNER);
        assert!(batch.is_active, EBATCH_NOT_FOUND);

        // Basic phone number validation
        assert!(length(&phone_number) >= 10, EINVALID_PHONE);

        batch.phone_notifications = phone_number;
    }

    // Register a new product batch (requires approval)
    public entry fun register_batch(
        owner: &signer,
        product_name: String,
        product_type: String,
        quantity: u64,
        manufacturing_date: u64,
        origin_location: String,
        destination: String,
        tags: vector<String>,
        documents: vector<String>
    ) acquires SupplyChain {
        let owner_addr = signer::address_of(owner);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);
        assert!(quantity > 0, EINVALID_QUANTITY);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        let batch_id = supply_chain.next_batch_id;

        let new_batch = ProductBatch {
            id: batch_id,
            owner: owner_addr,
            product_name,
            product_type,
            quantity,
            manufacturing_date,
            origin_location,
            destination,
            current_location: copy origin_location,
            status: utf8(STATUS_PENDING),
            tags,
            documents,
            created_at: aptos_framework::timestamp::now_seconds(),
            updated_at: aptos_framework::timestamp::now_seconds(),
            approved_by: @0x0,
            is_active: true,
            phone_notifications: utf8(b"")
        };

        table::add(&mut supply_chain.batches, batch_id, new_batch);
        supply_chain.next_batch_id = batch_id + 1;

        // Emit creation event
        event::emit_event(
            &mut supply_chain.batch_created_events,
            BatchCreatedEvent {
                batch_id,
                owner: owner_addr,
                product_name: copy product_name,
                quantity,
                created_at: aptos_framework::timestamp::now_seconds()
            }
        );
    }

    // Approve a batch (only callable by approved wallet)
    public entry fun approve_batch(
        approver: &signer,
        owner_addr: address,
        batch_id: u64
    ) acquires SupplyChain {
        let approver_addr = signer::address_of(approver);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.batches, batch_id), EBATCH_NOT_FOUND);

        let batch = table::borrow_mut(&mut supply_chain.batches, batch_id);
        assert!(batch.status == utf8(STATUS_PENDING), EINVALID_STATUS);
        assert!(batch.is_active, EBATCH_NOT_FOUND);

        batch.status = utf8(STATUS_APPROVED);
        batch.approved_by = approver_addr;
        batch.updated_at = aptos_framework::timestamp::now_seconds();

        // Emit approval event
        event::emit_event(
            &mut supply_chain.batch_approved_events,
            BatchApprovedEvent {
                batch_id,
                approved_by: approver_addr,
                approved_at: aptos_framework::timestamp::now_seconds()
            }
        );

        // Emit status change event
        event::emit_event(
            &mut supply_chain.batch_status_events,
            BatchStatusEvent {
                batch_id,
                old_status: utf8(STATUS_PENDING),
                new_status: utf8(STATUS_APPROVED),
                updated_at: aptos_framework::timestamp::now_seconds()
            }
        );
    }

    // Update batch status (only owner or approved wallet)
    public entry fun update_batch_status(
        updater: &signer,
        owner_addr: address,
        batch_id: u64,
        new_status: String,
        new_location: String,
        notes: String
    ) acquires SupplyChain {
        let updater_addr = signer::address_of(updater);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.batches, batch_id), EBATCH_NOT_FOUND);

        let batch = table::borrow_mut(&mut supply_chain.batches, batch_id);
        assert!(batch.is_active, EBATCH_NOT_FOUND);
        assert!(
            batch.owner == updater_addr || batch.approved_by == updater_addr,
            ENOT_OWNER
        );

        let old_status = batch.status;
        batch.status = new_status;
        batch.current_location = new_location;
        batch.updated_at = aptos_framework::timestamp::now_seconds();

        // Record the event
        let event_id = supply_chain.next_event_id;
        table::add(
            &mut supply_chain.events,
            event_id,
            BatchEvent {
                batch_id,
                event_type: copy new_status,
                location: copy new_location,
                timestamp: aptos_framework::timestamp::now_seconds(),
                notes
            }
        );
        supply_chain.next_event_id = event_id + 1;

        // Emit status change event
        event::emit_event(
            &mut supply_chain.batch_status_events,
            BatchStatusEvent {
                batch_id,
                old_status,
                new_status,
                updated_at: aptos_framework::timestamp::now_seconds()
            }
        );
    }

    // Create an order for a product batch
    public entry fun create_order(
        buyer: &signer,
        owner_addr: address,
        batch_id: u64,
        quantity: u64
    ) acquires SupplyChain {
        let buyer_addr = signer::address_of(buyer);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.batches, batch_id), EBATCH_NOT_FOUND);

        let batch = table::borrow(&supply_chain.batches, batch_id);
        assert!(batch.is_active, EBATCH_NOT_FOUND);
        assert!(batch.status == utf8(STATUS_APPROVED), EINVALID_STATUS);
        assert!(quantity > 0 && quantity <= batch.quantity, EINVALID_QUANTITY);

        let order_id = supply_chain.next_order_id;
        let now = aptos_framework::timestamp::now_seconds();

        let new_order = Order {
            order_id,
            batch_id,
            buyer: buyer_addr,
            quantity,
            order_date: now,
            delivery_date: 0,
            status: utf8(b"pending"),
            is_delivered: false
        };

        table::add(&mut supply_chain.orders, order_id, new_order);
        supply_chain.next_order_id = order_id + 1;

        // Emit order creation event
        event::emit_event(
            &mut supply_chain.order_created_events,
            OrderCreatedEvent {
                order_id,
                batch_id,
                buyer: buyer_addr,
                quantity,
                order_date: now
            }
        );
    }

    // Mark an order as delivered
    public entry fun mark_order_delivered(
        owner: &signer,
        order_id: u64
    ) acquires SupplyChain {
        let owner_addr = signer::address_of(owner);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.orders, order_id), EORDER_NOT_FOUND);

        let order = table::borrow_mut(&mut supply_chain.orders, order_id);
        assert!(!order.is_delivered, EORDER_NOT_FOUND);

        let now = aptos_framework::timestamp::now_seconds();
        order.is_delivered = true;
        order.delivery_date = now;
        order.status = utf8(b"delivered");

        // Emit delivery event
        event::emit_event(
            &mut supply_chain.order_delivered_events,
            OrderDeliveredEvent {
                order_id,
                delivery_date: now
            }
        );
    }

    // Submit feedback for an order (only after delivery)
    public entry fun submit_feedback(
        buyer: &signer,
        owner_addr: address,
        order_id: u64,
        rating: u8,
        tags: vector<String>,
        comments: String
    ) acquires SupplyChain {
        let buyer_addr = signer::address_of(buyer);
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);
        assert!(rating >= 1 && rating <= 5, EINVALID_RATING);

        let supply_chain = borrow_global_mut<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.orders, order_id), EORDER_NOT_FOUND);

        let order = table::borrow(&supply_chain.orders, order_id);
        assert!(order.buyer == buyer_addr, ENOT_OWNER);
        assert!(order.is_delivered, EORDER_NOT_DELIVERED);

        // Check if feedback already exists for this order
        let i = 1;
        while (i < supply_chain.next_feedback_id) {
            if (table::contains(&supply_chain.feedbacks, i)) {
                let feedback = table::borrow(&supply_chain.feedbacks, i);
                if (feedback.order_id == order_id) {
                    abort EFEEDBACK_EXISTS;
                };
            };
            i = i + 1;
        };

        let feedback_id = supply_chain.next_feedback_id;
        let now = aptos_framework::timestamp::now_seconds();

        let new_feedback = Feedback {
            feedback_id,
            batch_id: order.batch_id,
            order_id,
            buyer: buyer_addr,
            rating,
            tags,
            comments,
            created_at: now
        };

        table::add(&mut supply_chain.feedbacks, feedback_id, new_feedback);
        supply_chain.next_feedback_id = feedback_id + 1;

        // Emit feedback event
        event::emit_event(
            &mut supply_chain.feedback_events,
            FeedbackEvent {
                feedback_id,
                batch_id: order.batch_id,
                order_id,
                buyer: buyer_addr,
                rating,
                created_at: now
            }
        );
    }

    // View functions

    #[view]
    public fun get_batch(owner_addr: address, batch_id: u64): ProductBatch acquires SupplyChain {
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.batches, batch_id), EBATCH_NOT_FOUND);
        *table::borrow(&supply_chain.batches, batch_id)
    }

    #[view]
    public fun get_order(owner_addr: address, order_id: u64): Order acquires SupplyChain {
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.orders, order_id), EORDER_NOT_FOUND);
        *table::borrow(&supply_chain.orders, order_id)
    }

    #[view]
    public fun get_feedback(owner_addr: address, feedback_id: u64): Feedback acquires SupplyChain {
        assert!(exists<SupplyChain>(owner_addr), ENOT_INITIALIZED);
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        assert!(table::contains(&supply_chain.feedbacks, feedback_id), EFEEDBACK_EXISTS);
        *table::borrow(&supply_chain.feedbacks, feedback_id)
    }

    #[view]
    public fun get_batch_events(owner_addr: address, batch_id: u64): vector<BatchEvent> acquires SupplyChain {
        let result = vector::empty<BatchEvent>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };

        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_event_id) {
            if (table::contains(&supply_chain.events, i)) {
                let event = table::borrow(&supply_chain.events, i);
                if (event.batch_id == batch_id) {
                    vector::push_back(&mut result, *event);
                };
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun get_batches_count(owner_addr: address): u64 acquires SupplyChain {
        if (!exists<SupplyChain>(owner_addr)) {
            return 0
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        supply_chain.next_batch_id - 1
    }

    #[view]
    public fun get_orders_count(owner_addr: address): u64 acquires SupplyChain {
        if (!exists<SupplyChain>(owner_addr)) {
            return 0
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        supply_chain.next_order_id - 1
    }

    #[view]
    public fun get_feedbacks_count(owner_addr: address): u64 acquires SupplyChain {
        if (!exists<SupplyChain>(owner_addr)) {
            return 0
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        supply_chain.next_feedback_id - 1
    }

    #[view]
    public fun get_all_batches(owner_addr: address): vector<ProductBatch> acquires SupplyChain {
        let result = vector::empty<ProductBatch>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_batch_id) {
            if (table::contains(&supply_chain.batches, i)) {
                let batch = table::borrow(&supply_chain.batches, i);
                vector::push_back(&mut result, *batch);
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun get_all_orders(owner_addr: address): vector<Order> acquires SupplyChain {
        let result = vector::empty<Order>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_order_id) {
            if (table::contains(&supply_chain.orders, i)) {
                let order = table::borrow(&supply_chain.orders, i);
                vector::push_back(&mut result, *order);
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun get_all_feedbacks(owner_addr: address): vector<Feedback> acquires SupplyChain {
        let result = vector::empty<Feedback>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };
        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_feedback_id) {
            if (table::contains(&supply_chain.feedbacks, i)) {
                let feedback = table::borrow(&supply_chain.feedbacks, i);
                vector::push_back(&mut result, *feedback);
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun get_batch_feedbacks(owner_addr: address, batch_id: u64): vector<Feedback> acquires SupplyChain {
        let result = vector::empty<Feedback>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };

        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_feedback_id) {
            if (table::contains(&supply_chain.feedbacks, i)) {
                let feedback = table::borrow(&supply_chain.feedbacks, i);
                if (feedback.batch_id == batch_id) {
                    vector::push_back(&mut result, *feedback);
                };
            };
            i = i + 1;
        };
        result
    }

    #[view]
    public fun get_batch_orders(owner_addr: address, batch_id: u64): vector<Order> acquires SupplyChain {
        let result = vector::empty<Order>();
        if (!exists<SupplyChain>(owner_addr)) {
            return result;
        };

        let supply_chain = borrow_global<SupplyChain>(owner_addr);
        let i = 1;
        while (i < supply_chain.next_order_id) {
            if (table::contains(&supply_chain.orders, i)) {
                let order = table::borrow(&supply_chain.orders, i);
                if (order.batch_id == batch_id) {
                    vector::push_back(&mut result, *order);
                };
            };
            i = i + 1;
        };
        result
    }

    #[test_only]
    use std::string;

    #[test(admin = @0x123, approver = @0x456)]
    public entry fun test_supply_chain_flow(admin: signer, approver: signer) acquires SupplyChain {
        account::create_account_for_test(signer::address_of(&admin));
        account::create_account_for_test(signer::address_of(&approver));
        
        initialize_supply_chain(&admin);

        // Register a new batch
        register_batch(
            &admin,
            string::utf8(b"Organic Coffee"),
            string::utf8(b"Beverage"),
            1000,
            1234567890,
            string::utf8(b"Farm A, Colombia"),
            string::utf8(b"Warehouse B, USA"),
            vector[string::utf8(b"organic"), string::utf8(b"fair-trade")],
            vector[string::utf8(b"certificate1.pdf"), string::utf8(b"certificate2.pdf")]
        );

        let supply_chain = borrow_global<SupplyChain>(signer::address_of(&admin));
        assert!(table::contains(&supply_chain.batches, 1), 1);
        let batch = table::borrow(&supply_chain.batches, 1);
        assert!(batch.status == utf8(STATUS_PENDING), 2);

        // Approve the batch
        approve_batch(&approver, signer::address_of(&admin), 1);

        let batch = table::borrow(&supply_chain.batches, 1);
        assert!(batch.status == utf8(STATUS_APPROVED), 3);
        assert!(batch.approved_by == signer::address_of(&approver), 4);

        // Create an order
        create_order(&admin, signer::address_of(&admin), 1, 100);

        assert!(table::contains(&supply_chain.orders, 1), 5);
        let order = table::borrow(&supply_chain.orders, 1);
        assert!(order.batch_id == 1, 6);
        assert!(order.quantity == 100, 7);

        // Mark order as delivered
        mark_order_delivered(&admin, 1);

        let order = table::borrow(&supply_chain.orders, 1);
        assert!(order.is_delivered, 8);

        // Submit feedback
        submit_feedback(
            &admin,
            signer::address_of(&admin),
            1,
            5,
            vector[string::utf8(b"quality"), string::utf8(b"delivery")],
            string::utf8(b"Excellent product and service!")
        );

        assert!(table::contains(&supply_chain.feedbacks, 1), 9);
        let feedback = table::borrow(&supply_chain.feedbacks, 1);
        assert!(feedback.rating == 5, 10);
    }
}