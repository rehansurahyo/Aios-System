export const translations = {
  /* ======================================================
   * ENGLISH
   * ====================================================== */
  en: {
    app: {
      title: "AIOS Studio Control",
    },
    topbar: {
      subtitle: "Reception overview",
      dark: "Dark",
      light: "Light",
      menu: "Menu",
      language: "Language",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
      history: "Customer History",
      recentCustomers: "Recent Customers",
      alerts: "Alerts",
      notifications: "Notifications",
      noAlerts: "No new notifications"
    },
    status: {
      online: "Online",
    },
    btn: {
      start: "Start",
      cancel: "Cancel",
      close: "Close",
      details: "Details",
      maintenance: "Maintenance",
      endMaintenance: "End maintenance",
      cleaning: "Cleaning",
      endCleaning: "End Cleaning",
      unlock: "Unlock",
      edit: "Edit",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      back: "Back",
      save: "Save",
      actions: "Actions",
      select: "Select",
      nextStep: "Next Step",
      prevStep: "Back",
    },
    options: {
      yes: "Yes",
      no: "No",
    },
    errors: {
      required: "Required",
    },
    common: {
      retry: "Retry",
    },

    /* ---------- Dashboard ---------- */
    dash: {
      title: "Studio Control Dashboard",
      subtitle: "Live overview of all cabins • Reception view (design preview).",
      loadingCabins: "Loading cabins from AIOS backend…",
      loadError: "Could not load cabins from server.",
      liveStatus: "Live status (today)",
      deviceOverview: "Device overview",
      receptionLiveHeading: "Reception view · Live status",
      attention: "cabin requires attention · Reception will be notified automatically.",
      runningFreeCleaningErrorMaint: "{running} running • {free} free • {cleaning} cleaning • {errors} error{s} • {inMaintenance} in maintenance",
      modals: {
        cleaning: {
          title: "Mark for Cleaning",
          mark: "Mark",
          question: "for cleaning?",
          desc: "The device will be unavailable for {duration} minutes for cleaning.",
          start: "Start Cleaning",
          cancel: "Cancel"
        },
        maintenance: {
          title: "Start Maintenance",
          question: "Do you want to start maintenance for",
          warning: "This will cancel any active session on this device.",
          info: "Maintenance lasts 3 minutes and will auto-end after completion.",
          start: "Start Maintenance",
          cancel: "Cancel",
          end: "End Maintenance"
        },
        cancelSession: {
          title: "Cancel Session",
          question: "Are you sure you want to cancel the session on",
          info: "After cancellation, the device will be marked for cleaning for 3 minutes automatically.",
          confirm: "Cancel Session",
          keep: "Keep Running"
        },
        addUser: {
          title: "Add User to",
          nameLabel: "User Name",
          placeholder: "Enter user name",
          cancel: "Cancel",
          add: "Add User"
        },
        cabinDetails: {
          title: "CABIN DETAILS",
          device: "Device",
          users: "Users",
          bookings: "Bookings",
          logs: "Maintenance Logs",
          noUsers: "No users logged in",
          noBookings: "No bookings",
          noLogs: "No maintenance logs",
          started: "Started:",
          duration: "Duration:",
          minutes: "minutes",
          seconds: "seconds",
          remove: "Remove",
          unnamedBooking: "Unnamed booking",
          close: "Close"
        },
        startSession: {
          title: "START SESSION",
          subtitle: "Set session time (4-25 minutes) before starting.",
          preRunIncluded: "+3 minutes pre-run automatically included",
          selectDuration: "Select session duration",
          preRunTotal: "+3 Min pre-run = {total} Min total",
          min: "Minimum",
          last: "Last Booking",
          max: "Maximum",
          estPrice: "Estimated Price",
          preRunFree: "(for {minutes} minutes, pre-run time free)",
          start: "Start Session",
          starting: "Starting...",
          cancel: "Cancel",
          helpful: "The last booking is always based on the customer's last used duration. The system remembers this per customer for faster booking - without constantly pressing + / -."
        }
      },
      search: {
        placeholder: "Search customer...",
        searching: "Searching...",
        noResults: "No customers found",
        label: "Search for customers"
      },

    },
    userMgmt: {
      title: "User Management",
      subtitle: "Manage users and roles for the studio.",
      users: "Users",
      roles: "Roles",
      addUser: "New User",
      createRole: "Create Role",
      searchPlaceholder: "Quick search...",
      filterAll: "All",
      filterActive: "Active",
      filterAll: "All",
      filterActive: "Active",
      newCustomer: "New Customer",
      noUsers: "No users found. Create one!",
      noRoles: "No roles yet.",
      roleParentNone: "Parent: None",
      roleDelete: "Delete",
      table: {
        username: "Username",
        firstname: "First Name",
        lastname: "Last Name",
        roles: "Roles",
        status: "Status",
        status: "Status",
        actions: "Actions",
        data: "Data",
        addr: "Addr",
        dob: "DOB",
        type: "Type",
        action: "Action"
      },
      roleEditor: {
        name: "Name",
        nameRequired: "This field is required",
        rights: "Permissions",
        hierarchy: "Role Hierarchy",
        descInfo: "Description of the right is displayed here.",
        cancel: "Cancel",
        save: "Save",
        placeholder: "Role Name",
        permissions: {
          backOffice: "Back-Office",
          freetimeBooking: "Freetime booking without signature",
          termination: "Manage termination without signature",
          userManagement: "User Management",
          loginEdit: "Login Edit",
          fullAccess: "Full Access"
        }
      },
      wizard: {
        title: "New User",
        steps: {
          select: "Select Person",
          login: "Create Login",
          roles: "Add Roles",
          confirm: "Confirmation"
        },
        fields: {
          firstname: "First Name",
          lastname: "Last Name",
          customerNo: "Customer No.",
          username: "Username",
          password: "Password",
          locked: "Locked",
          hidden: "Hidden",
          changePwd: "Change Password",
          strongPwd: "Strong Password",
          centralLock: "Central Login Locked"
        },
        roleSelect: {
          all: "All Roles",
          active: "Active Role",
          error: "At least one role must be selected!"
        },
        finish: {
          title: "Done!",
          desc: "User successfully created."
        },
        buttons: {
          back: "Back",
          next: "Next",
          finish: "Finish",
          select: "Select"
        }
      }
    },
    stats: {
      totalCabins: "Total cabins",
      running: "Running",
      free: "Free",
      cleaning: "Cleaning",
    },

    /* ---------- Cabin / Device ---------- */
    cabin: {
      noImage: "No image selected yet",
      maintenanceTest: "3:00 min · maintenance test",
      minLeft: "min left",
      min: "min",
      noActiveCustomer: "No active customer",
      inUse: "In use",
    },



    /* ---------- Maintenance ---------- */
    maintenance: {
      title: "Start maintenance mode?",
      desc: "Do you really want to start a 3 minute maintenance test for",
      startBtn: "Start maintenance (3:00)",
    },

    /* ---------- Session / Start ---------- */
    start: {
      title: "Start session",
      subtitle: "Set session time (1–180 minutes) before starting.",
      selectDuration: "Select session duration for this device.",
      estimatedPrice: "Estimated price",
      starting: "Starting…",
      startBtn: "Start session",
      serverError: "Could not start session (server error).",
      networkError: "Network error while starting session.",
    },

    misc: {
      walkIn: "Walk-in",
      none: "None",
    },

    /* ---------- Bookings ---------- */
    bookings: {
      header: {
        kicker: "Calendar",
        title: "Cabin bookings",
        subtitle: "Admin view for daily bookings. Choose cabin & day, then create, edit, cancel or delete slots.",
      },
      form: {
        date: "Date",
        start: "Start",
        duration: "Duration",
        status: "Status",
        minutes: "min",
      },
      status: {
        booked: "Booked",
        completed: "Completed",
        cancelled: "Cancelled",
      },
      actions: {
        cancelEdit: "Cancel edit",
        saveChanges: "Save changes",
        addBooking: "+ Add booking",
        edit: "Edit",
        cancel: "Cancel",
        delete: "Delete",
      },
      overview: {
        kicker: "Daily overview",
      },
      label: {
        status: "Status:",
      },
      loading: "Loading bookings…",
      empty: "No bookings yet. Use the form above to create a slot.",
      noCabins: "No cabins – first create cabins in “Device Management”.",
      cabinFallback: "Cabin",
      confirm: {
        delete: "Delete this booking?",
      },
      errors: {
        loadBookings: "Could not load bookings.",
        loadBookingsNetwork: "Could not load bookings (network error).",
        createBooking: "Failed to create booking",
        updateBooking: "Failed to update booking",
        network: "Network error.",
      },
      success: {
        created: "Booking created.",
        updated: "Booking updated.",
      },
    },

    /* ---------- Cabins Page ---------- */
    cabins: {
      cabin: {
        minLeft: "min left",
        min: "min",
      },
      dashboardMgmtTitle: "Device Management",
      dashboardMgmtDesc: "Create or edit devices, controllers, types, and maintenance definitions.",
      dashboardMgmtBtn: "Device Management",
      dashboardGalleryTitle: "Device Gallery",
      dashboardGalleryDesc: "Upload images for specific devices here.",
      dashboardGalleryBtn: "Device Gallery",

      header: {
        kicker: "DEVICE MANAGEMENT",
        title: "Cabins & devices",
        subtitle: "Manage all studio cabins, categories, device types and the image used on the reception overview.",
        overview: "Overview",
      },
      tabs: {
        overview: "Device Overview",
        types: "Device Types",
        controller: "Device Controller",
        maintenance: "Maintenance Types",
        management: "Cabin Management",
        general: "General",
        technical: "Technical",
      },
      types: {
        title: "Manage Device Types",
        subtitle: "Add or remove valid device types for categorization.",
        placeholder: "New type name...",
        add: "+ Add",
        deleteConfirm: "Delete type \"{type}\"?"
      },
      controller: {
        title: "Controller Configuration",
        subtitle: "Overview of all physical device connections",
        viewAll: "View All",
        controllerType: "Controller Type"
      },
      maintenance: {
        title: "Maintenance Definitions",
        fieldName: "Name",
        fieldDuration: "Dur. (min)",
        placeholderName: "e.g. Filter Change",
        add: "Add",
        durationFormat: "{duration} min duration",
        noDuration: "No fixed duration",
        deleteConfirm: "Delete this maintenance type?"
      },
      management: {
        title: "Global Cabin Management",
        stopTitle: "Global Emergency Stop",
        stopDesc: "Immediately stop all running sessions and set status to Error.",
        stopConfirm: "ARE YOU SURE? This will stop ALL devices immediately.",
        stopSuccess: "Emergency Stop Executed.",
        stopBtn: "TRIGGER STOP",
        resetTitle: "Reset All Controllers",
        resetDesc: "Set all devices to 'Free' status and disable maintenance mode.",
        resetConfirm: "Reset all devices to FREE status?",
        resetSuccess: "Systems Reset.",
        resetBtn: "Reset All",
        autoCleanTitle: "Auto-Cleaning Default",
        autoCleanDesc: "Set default cleaning time for all new devices"
      },
      program: {
        title: "Device Program",
        subtitle: "Configure default settings and presets for this device.",
        presets: {
          label: "Preset",
          standard: "Standard",
          sensitive: "Sensitive",
          intensive: "Intensive",
          custom: "Custom"
        },
        settings: {
          intensity: "UV Intensity",
          faceTanner: "Face Tanner",
          fanSpeed: "Fan Speed",
          aroma: "Aroma",
          aquaMist: "Aqua Mist",
          airCon: "Air Conditioning",
          voiceGuide: "Voice Guide",
          targetTemp: "Target Temp. (°C)"
        }
      },
      actions: {
        restartController: "Restart Device Control",
        restartPeripheral: "Restart Peripheral Control",
        newDevice: "New Device",
        searchPlaceholder: "Quick search...",
        filterAll: "All",
        filterDevices: "All Devices",
        showHidden: "Show hidden devices",
        back: "Back",
        maintenanceReport: "Device Maintenance Report",
        usageReport: "Device Usage Report",
      },
      table: {
        name: "Device Name",
        type: "Device Type",
        controller: "Controller/Local Port",
        deviceStatus: "Device Status",
        articleVisible: "Article Visible",
        status: "Status",
        maintenanceStatus: "Maintenance Status",
      },
      wizard: {
        steps: {
          data: "Device Data",
          controller: "Device Controller",
          maintenance: "Maintenance",
          program: "Device Program",
          confirm: "Confirmation",
        },
        manufacturer: "Manufacturer",
        deviceName: "Device Name",
        deviceNumber: "Device Number",
        deviceType: "Device Type",
        description: "Description",
        powerTitle: "Tanning Strength",
        kw: "KW",
        joule: "Joule",
        uvStrength: "UV Strength",
        uvRating: "UV Rating",
        helpRequired: "This field is required",
        enterManufacturer: "Enter manufacturer",
        enterName: "Enter device name",
        enterNumber: "Enter device number",
        selectType: "Select device type",
        enterDescription: "Enter description",
        basics: "Basic Details",
        confirm: {
          title: "Ready to Save?",
          subtitle: "Please review the device data. You can go back to make changes.",
          name: "Name",
          type: "Type",
          controller: "Controller",
          btnSave: "Save",
          saving: "Saving..."
        },
      },
      errors: {
        load: "Unable to load cabins from server.",
        delete: "Could not delete cabin.",
        generic: "Something went wrong.",
      },

      form: {
        editTitle: "Edit cabin",
        addTitle: "Add new cabin",
        desc: "Define cabin code, device type and the image URL that appears on the main dashboard.",
        cabinCode: "Cabin code",
        cabinName: "Cabin name",
        category: "Category",
        deviceType: "Device type",
        statusDemo: "Status (demo)",
        imageUrl: "Image URL",
        previewLabel: "Preview (dashboard thumbnail)",
        saving: "Saving...",
        creating: "Creating...",
        saveChanges: "Save changes",
        addCabin: "Add cabin",
        cancelEdit: "Cancel edit",
        autoCleanEnabled: "Auto-clean after session",
        autoCleanDuration: "Clean duration (minutes)",
        leadTimeMinutes: "Lead time (minutes)",
        ipAddress: "IP Address",
        macAddress: "MAC Address",
        controllerType: "Controller Type",
        localPort: "Local Port",
        externalPort: "External Port",
        preRunTime: "Pre-Run Time",
        postRunTime: "Post-Run Time",
        deviceTypePlaceholder: "Select device type",
        pricingGroup: "Pricing Group",
        startMaintenance: "Start Maintenance Mode",
        manufacturer: "Manufacturer",
        deviceNumber: "Device Number",
        description: "Description",
        powerStats: "Tanning Strength",
        kw: "KW",
        joule: "Joule",
        uvRating: "UV Strength",
        seconds: "Seconds",
        specialDetails: "Details - Special",
        allowCalendar: "Allow Calendar Bookings",
        allowWebCalendar: "Allow Web Calendar Bookings",
        allowApp: "Allow App Bookings",
        hideDevice: "Hide Device",
        hideDeviceDesc: "Device will be hidden from checkout and list",
        inOperation: "Device in Operation",
        selfService: "Available for Self-Service",
        cabinInfoText: "Cabin Info Text",
        showOnMonitor: "Show on External Monitor",
        infoText: "Text",
        delete: "Delete",
        confirmDelete: "Delete this device?",
        maintenanceHelp: "Forces device into maintenance mode regardless of status",
        placeholders: {
          name: "e.g. Ergoline",
          number: "e.g. 22",
          imageUrl: "Or enter image URL manually...",
          ip: "192.168.1.xxx",
          mac: "00:1B:44:11:3A:B7"
        },
      },
      unit: {
        seconds: "Seconds"
      },
      maintenanceModal: {
        title: "Maintenance Types",
        name: "Name",
        interval: "Interval",
        select: "Select"
      },
      programTable: {
        title: "Program Overview",
        name: "Program Name",
        actions: "Actions",
        newProgram: "New Program",
        empty: "No data available!"
      },
      articleModal: {
        title: "Article Details for {name}",
        tabs: {
          master: "Master Data",
          prices: "Prices"
        },
        masterData: {
          title: "Article Master Data",
          edit: "Start Editing",
          org: "Organization",
          revenue: "Revenue Account",
          tax: "Tax Type",
          group: "Product Group",
          name: "Article Name",
          no: "Article No.",
          desc: "Description",
          barcode: "Barcode"
        },
        special: {
          title: "Article Master Data - Special Options",
          security: "Security Level",
          unit: "Unit",
          freePrice: "Free Pricing",
          maxPrice: "Max Price",
          negativePrice: "Allow Negative Price",
          hide: "Hide Article",
          hideAmounts: "Hide Amounts",
          stockable: "Stockable",
          specialFunc: "Special Function",
          staticRevenue: "Static Revenue",
          requiredFile: "File Required",
          validFrom: "Valid From",
          validTo: "Valid To",
          yes: "Yes",
          no: "No",
          maxPricePlaceholder: "Enter max price"
        },
        discount: {
          title: "Discount Settings",
          general: "General Discount",
          manual: "Manual Discount Possible?"
        },
        actions: {
          close: "Close",
          save: "Save"
        },
        prices: {
          title: "Current Price List",
          currency: "Select Currency",
          fixedUnit: "Fixed Unit Size",
          edit: "Edit Price List",
          end: "End Editing",
          unit: "Unit",
          price: "Price",
          save: "Save",
          close: "Close"
        }
      },
      deviceTypes: {
        sunbed: "Sunbed",
        hybrid: "Hybrid Sunbed",
        beauty: "Beauty / Collagen",
        bodyformer: "Bodyformer",
        other: "Other"
      },

      list: {
        title: "All cabins",
        loading: "Loading cabins...",
        configured: "{count} cabin(s) configured",
        empty: "No cabins yet. Add your first cabin on the left.",
        infoHidden: "Devices with hidden articles are not shown in checkout or device overview",
      },
      status: {
        free: "Free",
        running: "Running",
        cleaning: "Cleaning",
        cleaned: "Cleaned",
        error: "Error",
        maintenance: "Maintenance",
      },

      card: {
        noCategory: "No category",
        edit: "Edit",
        delete: "Delete",
        leadTime: "Lead time",
        autoClean: "Auto-clean",
      },
    },

    /* ---------- Reports Page ---------- */
    reports: {
      header: {
        kicker: "REPORTS",
        title: "Usage & revenue",
        subtitle: "Simple overview of cabin usage and revenue (live data based on bookings).",
      },
      states: {
        loading: "Loading reports…",
        noBookingsLast7Days: "No bookings in the last 7 days.",
      },
      kpi: {
        revenueToday: "Revenue today",
        revenueThisWeek: "Revenue this week",
        peakTimeToday: "Peak time today",
      },
      kpiHelpers: {
        approxFromSessions: "Approx. from sessions",
        last7Days: "Last 7 days",
        mostActiveStartTime: "Most active start time",
      },
      usage: {
        title: "Weekly cabin usage",
        basedOnLast7Days: "Based on last 7 days",
      },
      errors: {
        load: "Could not load reports.",
        network: "Could not load reports (network error).",
      },
    },

    /* ---------- Pricing Page (Re-added) ---------- */
    pricing: {
      header: {
        kicker: "Global Pricing",
        title: "Pricing Management",
        subtitle: "Manage base prices and minute-by-minute pricing for all cabins.",
      },
      loading: "Loading pricing...",
      cabin: {
        basePrice: "Base Price",
        perMin: "€ / min",
        addMinutes: "+ Add special minutes",
        minuteRows: "minute rows",
        min: "min",
        save: "Save",
        saving: "Saving...",
        delete: "Delete",
        addNextMinute: "New (add next minute)",
        exportInfo: "Tip: Export will include up to",
        minutes: "minutes",
        pricePlaceholder: "Price"
      },
      bulk: {
        selectBoards: "Select boards",
        selectAll: "Select All",
        selectNone: "Select None",
        refresh: "Refresh",
        copyFrom: "Copy from (Source)",
        copyToSelected: "Copy to selected",
        applySamePrice: "Apply base price",
        apply: "Apply",
        exportExcel: "Export Excel",
        importExcel: "Import Excel",
        exportInfo: "Download current pricing as .xlsx",
        saving: "Saving...",
        saveAll: "Save All Changes",
        copyTo: "Copy to",
      },
      modal: {
        title: "Add Special Minute Price",
        desc: "Define a custom price for a specific minute duration.",
        placeholder: "Minute (e.g. 10)",
        cancel: "Cancel",
        add: "Add",
      },
      excel: {
        minute: "Minute",
        cabin: "Cabin",
        basePrice: "Base Price (€/min)",
        min: "min",
      },

      message: {
        saved: "Pricing saved successfully.",
        saveFailed: "Failed to save pricing.",
        copied: "Pricing copied to selected cabins.",
        exported: "Pricing exported to Excel.",
        imported: "Pricing imported from Excel.",
        importFailed: "Failed to import Excel.",
        loadFailed: "Failed to load pricing.",
        addMinutesError: "Invalid minute or price.",
        addMinutesSuccess: "Added special pricing for {count} minute(s).",
      },
    },

    users: {
      title: "User Management",
      subTitle: "MANDATOR GROUP: SUNNO0542",
      tabs: {
        users: "Users",
        roles: "Roles",
      },
      list: {
        searchPlaceholder: "Quick search...",
        newUser: "+ New User",
        showHidden: "Show hidden logins too",
        columns: {
          username: "Username",
          name: "Name",
          surname: "Surname",
          roles: "Roles",
          status: "Status",
          actions: "Actions",
        },
        status: {
          active: "Active",
          inactive: "Inactive",
        },
        loading: "Loading users...",
        empty: "No users found in database.",
      },
      roles: {
        createTitle: "Create Role",
        editTitle: "Edit Role",
        btnCancel: "Cancel",
        btnSave: "Save",
        fieldRequired: "This field is required",
        overview: "Role Overview",
        parent: "PARENT",
        none: "NONE",
        nameLabel: "Name",
        tabs: {
          rights: "Rights",
          hierarchy: "Role Hierarchy",
        },
        hierarchy: {
          allRoles: "All Roles",
          parentRoles: "Parent Roles",
        },
        rights: {
          showHidden: "Show unselectable rights",
          filter: "Filter...",
          description: "The description of a right is displayed here. Select the right or click on the name of the right.",
        }
      },
      wizard: {
        title: "New User",
        step: "Step",
        steps: {
          person: "Select Person",
          login: "Create Login",
          roles: "Add Roles",
          confirm: "Confirmation",
        },

        btnNext: "Next",
        btnBack: "Back",
        btnSave: "Save",
        searchPerson: "Quick search...",
        roleAssign: {
          allRoles: "All Roles",
          activeRoles: "Active Roles",
          oneActiveLimit: "Only one active object allowed!",
          selectOne: "Please select at least one role.",
        },
        confirm: {
          title: "Ready to save?",
          subtitle: "User {user} will be saved with {count} roles.",
          status: "Status",
          roles: "Roles",
          password: "Password",
          locked: "Locked",
          active: "Active",
          set: "Set",
          unchanged: "Same as before",
        },
        loading: "Loading users...",
        empty: "No users found in database.",
        login: {
          username: "Username",
          password: "Password (leave empty to keep unchanged)",
          passwordRepeat: "Repeat Password",
          generated: "Generate Password",
          matchError: "Passwords do not match",
          customerData: "Customer Data",
          address: "Address",
          dob: "Date of Birth",
          tags: "Tags",
          type: "Type",
          locked: "Locked",
          hidden: "Hidden",
          changePwdOnLogin: "Change password on login",
          pwdStrong: "Strong password",
          centralLoginLocked: "Central login locked",
          fieldRequired: "This field is required",
          firstName: "First Name",
          lastName: "Last Name",
          customerNumber: "Customer No.",
          generatedHint: "(Auto-generated on save if empty)",
        },
      },
    },

    /* ---------- Customer (Singular: Form/Edit) ---------- */
    customer: {
      steps: {
        step1: "Master Data",
        step2: "Address",
        step3: "Communication",
      },
      fields: {
        salutation: "Salutation",
        title: "Title",
        firstName: "First Name",
        lastName: "Last Name",
        birthDate: "Date of Birth",
        personNumber: "Person Number",
        skinType: "Skin Type",
        comment: "Comment",
        profileImage: "Profile Image",
        addressType: "Address Type",
        street: "Street",
        zipCode: "ZIP Code",
        city: "City",
        country: "Country",
        phone: "Phone",
        mobile: "Mobile",
        email: "Email",
      },
      placeholders: {
        street: "Street",
        houseNumber: "No.",
      },
      options: {
        mr: "Mr.",
        mrs: "Mrs.",
        ms: "Ms.",
        type1: "Type 1",
        type2: "Type 2",
        type3: "Type 3",
        type4: "Type 4",
        type5: "Type 5",
        type6: "Type 6",
        postal: "Postal Address",
        billing: "Billing Address",
        germany: "Germany",
        austria: "Austria",
        switzerland: "Switzerland",
      },
      hints: {
        imageUpload: "Unlimited size. Formats: PNG, JPG.",
      },
      addressHint: "Here you can enter the postal address required for the membership contract.",
      selectOption: "Select...",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      create: "Create Customer",
      creating: "Saving...",
      confirmDelete: "Are you sure you want to delete this customer?",
      createdError: "Failed to save customer",
    },

    /* ---------- Customers Page (List) ---------- */
    customers: {
      header: {
        title: "Customer list",
        subtitle: "Manage your customer relationships",
      },
      addCustomer: "Add Customer",
      searchPlaceholder: "Search name or email...",
      states: {
        loading: "Loading customers...",
        empty: "No customers in database.",
        noResults: "No customers found for your search.",
      },
      steps: {
        step1: "Master Data",
        step2: "Address",
        step3: "Communication",
      },
      fields: {
        salutation: "Salutation",
        title: "Title",
        firstName: "First Name",
        lastName: "Last Name",
        birthDate: "Date of Birth",
        personNumber: "Person Number",
        skinType: "Skin Type",
        comment: "Comment",
        profileImage: "Profile Image",
        addressType: "Address Type",
        street: "Street",
        zipCode: "ZIP Code",
        city: "City",
        country: "Country",
        phone: "Phone",
        mobile: "Mobile",
        email: "Email",
        lastVisit: "Last visit",
        noContact: "No contact info",
      },
      placeholders: {
        street: "Street",
        houseNumber: "No.",
      },
      options: {
        mr: "Mr.",
        mrs: "Mrs.",
        ms: "Ms.",
        type1: "Type 1",
        type2: "Type 2",
        type3: "Type 3",
        type4: "Type 4",
        type5: "Type 5",
        type6: "Type 6",
        postal: "Postal Address",
        billing: "Billing Address",
        germany: "Germany",
        austria: "Austria",
        switzerland: "Switzerland",
      },
      hints: {
        imageUpload: "Unlimited size. Formats: PNG, JPG.",
      },
      addressHint: "Here you can enter the postal address required for the membership contract.",
      selectOption: "Select...",
      cancel: "Cancel",
      back: "Back",
      next: "Next",
      create: "Create Customer",
      creating: "Saving...",
      confirmDelete: "Are you sure you want to delete this customer?",
      createdError: "Failed to save customer",
      errors: {
        firstNameRequired: "First Name is required",
        lastNameRequired: "Last Name is required",
        communicationRequired: "At least one communication method is required",
      },
    },

    /* ---------- Settings Page (English) ---------- */
    settings: {
      loading: "Loading settings...",
      error: "Failed to load settings from server.",
      errorGeneric: "An unexpected error occurred. Please try again later.",
      header: {
        kicker: "SYSTEM",
        title: "System settings",
        subtitle: "Manage your studio profile and device configurations.",
        liveConfig: "Live Config",
      },
      studioProfile: {
        title: "Studio Profile",
        description: "General information about your studio location.",
        fields: {
          studioName: "Studio Name",
          city: "City",
          phone: "Phone",
          email: "E-Mail",
        },
      },
      deviceGroups: {
        title: "Device Groups",
        description: "Grouped cabin configurations.",
        devices: "{count} device(s)",
      },
      userAccounts: {
        title: "User Accounts",
        description: "Registered system users and roles.",
        roleAdmin: "Administrator",
        roleReception: "Reception",
        adminDesc: "Full access to all settings",
        receptionDesc: "Limited access to dashboard",
        rbacInfo: "Role-based access control is active.",
      },
    },

    /* ---------- Article Management (New) ---------- */
    article: {
      steps: {
        step1: "Create Article (1)",
        step2: "Create Article (2)",
        step3: "Add Prices",
        step4: "Confirmation",
      },
      headers: {
        addArticleData: "Add Article Data",
      },
      fields: {
        organization: "Organization",
        revenueAccount: "Revenue Account",
        taxType: "Tax Type",
        productGroup: "Product Group",
        articleName: "Article Name",
        articleNo: "Article No.",
        description: "Description",
        barcode: "Barcode",
        unit: "Unit",
        allowFreePrice: "Allow free pricing",
        allowNegativePrice: "Allow negative prices",
        hideAmount: "Hide amount",
        specialFunction: "Special function",
        fileRequired: "File required on purchase",
        validPeriod: "Select a valid period?",
        generalDiscount: "General discount",
        stockable: "Stockable",
        statisticalSales: "Statistical sales",
        unit: "Unit",
        allowFreePrice: "Allow free price",
        allowNegativePrice: "Allow negative price",
        hideAmount: "Hide amount",
        specialFunction: "Special function",
        fileRequired: "File required on purchase",
        validPeriod: "Select valid period?",
        generalDiscount: "General discount",
      },
      settings: {
        rightsLevel: "Rights Level",
        unitSelection: "Select Unit",
        units: {
          piece: "Piece",
          time: "Time"
        },
        allowFreePrice: "Allow free price",
        allowNegativePrice: "Allow negative prices",
        hideAmount: "Hide amounts",
        specialFunction: "Special function",
        fileRequired: "File required on purchase",
        validPeriod: "Select valid period?",
        generalDiscount: "General discount",
        stockable: "Stockable",
        statisticalSales: "Statistical sales",
        functions: {
          none: "None",
          contingent: "Create contingent",
          emptyBooking: "Create empty booking on cancellation",
          module: "Module",
          device: "Activate device"
        }
      },
      pricing: {
        header: "Edit price list",
        selectCurrency: "Select currency",
        fixedUnitSize: "Fixed unit size",
        unit: "Unit",
        price: "Price",
        addPrice: "Add Price",
        removePrice: "Remove Price"
      },
      categories: {
        cabins: "Cabins",
        cosmetics: "Cosmetics",
        drinks: "Drinks",
        cards: "Value Cards",
        hygiene: "Hygiene Articles",
        groupon: "Groupon",
        vouchers: "Voucher Sales",
        counter: "Counter Booking",
        others: "Others",
        cancellation: "Special Cancellation",
      },
      filter: {
        all: "All",
      },
      groups: {
        header: "Article Groups",
        createTitle: "Create / Edit Group",
        fields: {
          name: "Group Name",
          org: "Organization",
          parent: "Parent Group",
          desc: "Description",
          showInPos: "Show in Checkout",
          color: "Color",
          colorSelection: "Select Color",
          owner: "Owner",
          order: "Order",
          manualDiscount: "Manual Discount",
        },
        stockTaking: {
          title: "Stock Taking Wizard",
          entry: "Enter Current Stock",
          review: "Report",
          correct: "Correction",
          infoStep1: "Articles with barcodes can be scanned. Afterwards, their stock count can be entered in a popup.",
          infoStep2: "Articles with barcodes can be scanned. Afterwards, a remark can be entered in a popup.",
          viewProtocol: "View Stock Protocol",
          confirmReport: "Confirm Report",
          backToView: "Back to previous view",
          backToStep: "Back to previous step",
          back: "Back",
          cancel: "Cancel",
          next: "Next",
          confirm: "Next ->",
          currentStock: "Current Stock",
          newStock: "New Stock",
          difference: "Difference",
          showHidden: "Show hidden articles",
          remark: "Remark",
          status: "Status",
          articleNo: "Art-No.",
          articleName: "Art-Name",
          articleGroup: "Art-Group",
          start: "Start Stock Taking",
          lastCount: "Last Count",
          remarkPlaceholder: "Enter reason"
        },
        buttons: {
          listArticles: "List Articles",
          edit: "Edit",
          delete: "Delete",
          add: "Add",
        },
      },
      list: {
        viewAll: "View All Articles",
        searchPlaceholder: "Quick search...",
        newArticle: "New Article",
        cart: "Cart",
        empty: "Empty",
        noArticles: "No articles in cart",
        shortcuts: "Shortcuts",
      },
      placeholders: {
        articleName: "Enter article name",
        articleNo: "Enter article number",
      },
      messages: {
        fieldRequired: "This field is required",
        generate: "Generate",
        captureBarcode: "Capture Barcode",
        back: "Back",
        next: "Next",
        abort: "Cancel",
        save: "Save",
        confirmDelete: "Are you sure you want to delete this article?",
        backToOverview: "Back to Overview",
      },
      options: {
        select: "Select option",
        piece: "Piece",
        time: "Time",
        none: "None",
        yes: "Yes",
        no: "No",
        allArticles: "All Articles",
        rightsLevel0: "Rights Level 0",
        rightsLevel1: "Rights Level 1",
        tax19: "19% VAT",
        tax7: "7% VAT",
        revenueAcc8400: "8400 (Revenue (Studio) 19%)",
        currencyEur: "EUR / €",
        checkout: "Checkout",
        paymentMethod: "Payment Method",
        cash: "Cash",
        card: "Card",
        confirmPayment: "Confirm Payment",
        totalToPay: "Total",
        paymentSuccess: "Payment Successful",
        vatIncluded: "incl. {rate}% VAT",
      },
      dashboard: {
        articles: { title: "Create/Edit Articles", desc: "Create and edit articles and add other options (e.g. prices)." },
        groups: { title: "Article Groups", desc: "Create and edit article groups." },
        stock: { title: "Stock Management", desc: "Manage stock bookings, suppliers and view stock movements." },
        contingents: { title: "Manage Contingents", desc: "Create and edit article contingents." },
        units: { title: "Manage Units", desc: "Create and edit article units." },
        inventory: { title: "Inventory", desc: "Perform inventory for all stockable articles." },
        pricing: { title: "Pricing Agreements", desc: "Assign individual prices to articles and save assignments." }
      },
      units_management: {
        header: "Unit Management",
        createTitle: "Create New Unit",
        editTitle: "Edit Unit",
        fields: {
          name: "Unit Name (e.g. Kilogram)",
          code: "Unit Code (e.g. kg)"
        },
        save: "Save Unit",
        delete: "Delete Unit",
        confirmDelete: "Delete this unit?"
      },
      inventory: {
        header: "Inventory Management",
        listTitle: "Stock Overview",
        active: "Active",
        min: "Minimum",
        max: "Maximum",
        stock: "Stock",
        lastCount: "Last Count",
        diff: "Difference",
        settings: "Inventory Settings",
        booking: "Stock Booking",
        journal: "Stock Journal",
        actions: {
          bookIn: "Book In",
          bookOut: "Book Out",
          correction: "Correction"
        },
        fields: {
          amount: "Amount",
          date: "Date",
          remark: "Remark",
          user: "User",
          action: "Action",
          before: "Before",
          movement: "Movement",
          after: "After"
        },
        messages: {
          saved: "Inventory settings saved!",
          booked: "Booking successful!",
          error: "Error processing request",
          reason: "Reason for booking...",
          noChanges: "No changes to save."
        },
        list: {},
      },
      contingents: {
        header: "Article Quota Overview",
        createTitle: "Create New Article Quota",
        sections: {
          basicData: "Basic Data",
          trigger: "Quota Creation Trigger",
          usableArticles: "Usable Articles"
        },
        fields: {
          designation: "Designation",
          org: "Organization",
          currency: "Currency",
          accountType: "Account Type",
          priority: "Deduction Priority",
          validity: "Validity Duration",
          article: "Article",
          quotaType: "Quota Type"
        },
        labels: {
          allArticles: "All Articles"
        },
        options: {
          select: "Select option...",
          passiveIndex: "Impersonal Account (Passive)",
          activeIndex: "Impersonal Account (Active)",
          creditor: "Personal Account Suppliers (Creditor)",
          debitor: "Personal Account Customers (Debitor)",
          highest: "Highest",
          high: "High",
          normal: "Normal",
          low: "Low",
          lowest: "Lowest",
          year: "Year",
          years: "Years",
          months: "Months",
          days: "Days",
          fixedValue: "Fixed Value",
          byQuantity: "By Quantity",
          byPrice: "By Price",
          voucher: "Voucher"
        },
        buttons: {
          add: "Add Quota",
          save: "Save",
          back: "Back to Overview",
          details: "Details",
          delete: "Delete",
          select: "Select"
        },
        errors: {
          required: "This field is required"
        }
      },
    },
    priceAgreement: {
      title: "Price Agreement Management",
      createTitle: "Create Price Agreement",
      editTitle: "Edit Price Agreement",
      new: "New",
      back: "Back to overview",
      startEdit: "Start editing",
      delete: "Delete Price Agreement",
      confirmDelete: "Are you sure you want to delete this price agreement?",
      copy: "Copy",
      copyWarning: "Copying is the better alternative!",
      copyMessage: "It is not recommended to create a new price agreement from scratch! Old prices are no longer available if tariffs are extended to this price agreement in the future. You should instead create a new price agreement by copying the current standard price agreement or the central dummy price agreement.",
      proceed: "Proceed anyway",
      cancel: "Cancel",
      fields: {
        name: "Price Agreement Name",
        description: "Description",
        isStandard: "Set as standard",
        isHidden: "Hide",
        changeOnContract: "Change on contract change",
        changeOnContract_short: "Change (Contr.)",
        changeOnExtension: "Change on contract extension",
        changeOnExtension_short: "Change (Ext.)",
        validFrom: "Valid from",
        validTo: "Valid to",
        priority: "Priority"
      },
      tabs: {
        basic: "Basic Data",
        articles: "Assigned Articles",
        persons: "Assigned Persons"
      },
      articles: {
        add: "Add Article",
        filter: "Filter: {count} options selected",
        price: "Art-Price",
        status: "Status",
        noArticles: "No articles assigned.",
        loading: "Loading articles...",
        noArticlesFound: "No articles found in this category.",
        selectArticle: "Select Article",
        searchPlaceholder: "Search article...",
        group: "Art-Group",
        removeConfirm: "Remove this article?"
      },
      persons: {
        add: "Add Person",
        addTitle: "Add Person",
        select: "Select Person",
        manage: "Manage Assignment",
        customerData: "Customer Data",
        birthDate: "Date of Birth",
        noPersons: "No persons assigned.",
        changePriority: "Change Priority",
        removeConfirm: "Remove this person?"
      },
      save: "Save",
      errors: {
        required: "This field is required",
        articleExists: "Article already assigned",
        personExists: "Person already assigned"
      },
      success: {
        articleAdded: "Article added successfully",
        personAdded: "Person added successfully",
        articleRemoved: "Article removed successfully",
        personRemoved: "Person removed successfully",
        copied: "Copied successfully",
        saved: "Saved successfully",
        deleted: "Deleted successfully"
      }
    }

  },


  /* ======================================================
   * GERMAN
   * ====================================================== */
  de: {
    app: {
      title: "AIOS Studio Steuerung",
    },
    topbar: {
      subtitle: "Empfangsübersicht",
      dark: "Dunkel",
      light: "Hell",
      menu: "Menü",
      language: "Sprache",
      switchToLight: "Zu hellem Design wechseln",
      switchToDark: "Zu dunklem Design wechseln",
      history: "Kundenhistorie",
      recentCustomers: "Letzte Kunden",
      alerts: "Warnungen",
      notifications: "Benachrichtigungen",
      noAlerts: "Keine neuen Benachrichtigungen"
    },
    status: {
      online: "Online",
    },
    btn: {
      start: "Start",
      cancel: "Abbrechen",
      close: "Schließen",
      details: "Details",
      maintenance: "Wartung",
      endMaintenance: "Wartung beenden",
      cleaning: "Reinigung",
      endCleaning: "Reinigung beenden",
      unlock: "Entsperren",
      edit: "Bearbeiten",
      delete: "Löschen",
      delete: "Löschen",
      back: "Zurück",
      save: "Speichern",
      actions: "Aktionen",
      select: "Auswählen",
      nextStep: "Nächster Schritt",
      prevStep: "Zurück",
    },
    options: {
      yes: "Ja",
      no: "Nein",
    },
    errors: {
      required: "Pflichtfeld",
    },

    common: {
      retry: "Wiederholen",
    },

    /* ---------- Dashboard ---------- */
    dash: {
      title: "Studio Steuerungs-Dashboard",
      subtitle: "Live-Übersicht aller Kabinen • Empfangsansicht (Designvorschau).",
      loadingCabins: "Kabinen werden vom AIOS-Backend geladen…",
      loadError: "Kabinen konnten nicht vom Server geladen werden.",
      liveStatus: "Live-Status (heute)",
      deviceOverview: "Geräteübersicht",
      receptionLiveHeading: "Empfangsansicht · Live-Status",
      attention: "Kabine benötigt Aufmerksamkeit · Empfang wird automatisch benachrichtigt.",
      runningFreeCleaningErrorMaint: "{running} läuft • {free} frei • {cleaning} Reinigung • {errors} Fehler{s} • {inMaintenance} in Wartung",
      modals: {
        cleaning: {
          title: "Zur Reinigung markieren",
          mark: "Markieren Sie",
          question: "zur Reinigung?",
          desc: "Das Gerät wird für {duration} Minuten für die Reinigung nicht verfügbar sein.",
          start: "Reinigung starten",
          cancel: "Abbrechen"
        },
        maintenance: {
          title: "Wartung starten",
          question: "Möchten Sie die Wartung für",
          warning: "Dadurch wird jede aktive Sitzung auf diesem Gerät abgebrochen.",
          info: "Wartung dauert 3 Minuten und wird nach Ablauf automatisch beendet.",
          start: "Wartung starten",
          cancel: "Abbrechen",
          end: "Wartung beenden"
        },
        cancelSession: {
          title: "Sitzung abbrechen",
          question: "Sind Sie sicher, dass Sie die Sitzung auf",
          info: "Nach dem Abbruch wird das Gerät automatisch für 3 Minuten zur Reinigung markiert.",
          confirm: "Sitzung abbrechen",
          keep: "Weiterlaufen lassen"
        },
        addUser: {
          title: "Benutzer hinzufügen zu",
          nameLabel: "Benutzername",
          placeholder: "Benutzername eingeben",
          cancel: "Abbrechen",
          add: "Benutzer hinzufügen"
        },
        cabinDetails: {
          title: "KABINEN-DETAILS",
          device: "Gerät",
          users: "Benutzer",
          bookings: "Buchungen",
          logs: "Wartungsprotokolle",
          noUsers: "Keine Benutzer angemeldet",
          noBookings: "Keine Buchungen",
          noLogs: "Keine Wartungsprotokolle",
          started: "Gestartet:",
          duration: "Dauer:",
          minutes: "Minuten",
          seconds: "Sekunden",
          remove: "Entfernen",
          unnamedBooking: "Unbenannte Buchung",
          close: "Schließen"
        },
        startSession: {
          title: "SITZUNG STARTEN",
          subtitle: "Sitzungszeit (4-25 Minuten) vor dem Start festlegen.",
          preRunIncluded: "+3 Minuten Vorlaufzeit automatisch inklusive",
          selectDuration: "Sitzungsdauer auswählen",
          preRunTotal: "+3 Min Vorlauf = {total} Min gesamt",
          min: "Minimum",
          last: "Letzte Buchung",
          max: "Maximum",
          estPrice: "Geschätzter Preis",
          preRunFree: "(für {minutes} Minuten, Vorlaufzeit kostenlos)",
          start: "Sitzung starten",
          starting: "Wird gestartet...",
          cancel: "Abbrechen",
          helpful: "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen."
        }
      },
      search: {
        placeholder: "Kundensuche...",
        searching: "Suche läuft...",
        noResults: "Keine Kunden gefunden",
        label: "Suchen Sie nach Kunden"
      },

    },
    stats: {
      totalCabins: "Kabinen gesamt",
      running: "Läuft",
      free: "Frei",
      cleaning: "Reinigung",
    },

    /* ---------- Cabin / Device ---------- */
    cabin: {
      noImage: "Noch kein Bild ausgewählt",
      maintenanceTest: "3:00 Min · Wartungstest",
      minLeft: "Min übrig",
      min: "Min",
      noActiveCustomer: "Kein aktiver Kunde",
      inUse: "In Benutzung",
    },

    /* ---------- Maintenance ---------- */
    maintenance: {
      title: "Wartungsmodus starten?",
      desc: "Möchten Sie wirklich einen 3-minütigen Wartungstest starten für",
      startBtn: "Wartung starten (3:00)",
    },

    /* ---------- Session / Start ---------- */
    start: {
      title: "Sitzung starten",
      subtitle: "Sitzungszeit (1–180 Minuten) vor dem Start festlegen.",
      selectDuration: "Sitzungsdauer für dieses Gerät auswählen.",
      estimatedPrice: "Geschätzter Preis",
      starting: "Startet…",
      startBtn: "Sitzung starten",
      serverError: "Sitzung konnte nicht gestartet werden (Serverfehler).",
      networkError: "Netzwerkfehler beim Starten der Sitzung.",
    },

    misc: {
      walkIn: "Spontan",
      none: "Keine",
    },

    /* ---------- Bookings ---------- */
    bookings: {
      header: {
        kicker: "Kalender",
        title: "Kabinenbuchungen",
        subtitle: "Admin-Ansicht für Tagesbuchungen. Kabine & Tag wählen, dann Slots erstellen, bearbeiten, stornieren oder löschen.",
      },
      form: {
        date: "Datum",
        start: "Start",
        duration: "Dauer",
        status: "Status",
        minutes: "Min",
      },
      status: {
        booked: "Gebucht",
        completed: "Abgeschlossen",
        cancelled: "Storniert",
      },
      actions: {
        cancelEdit: "Bearbeiten abbrechen",
        saveChanges: "Änderungen speichern",
        addBooking: "+ Buchung hinzufügen",
        edit: "Bearbeiten",
        cancel: "Stornieren",
        delete: "Löschen",
      },
      overview: {
        kicker: "Tagesübersicht",
      },
      label: {
        status: "Status:",
      },
      loading: "Buchungen werden geladen…",
      empty: "Noch keine Buchungen. Nutze das Formular oben, um einen Slot zu erstellen.",
      noCabins: "Keine Kabinen – zuerst Kabinen in „Device Management“ anlegen.",
      cabinFallback: "Kabine",
      confirm: {
        delete: "Diese Buchung löschen?",
      },
      errors: {
        loadBookings: "Buchungen konnten nicht geladen werden.",
        loadBookingsNetwork: "Buchungen konnten nicht geladen werden (Netzwerkfehler).",
        createBooking: "Buchung konnte nicht erstellt werden",
        updateBooking: "Buchung konnte nicht aktualisiert werden",
        network: "Netzwerkfehler.",
      },
      success: {
        created: "Buchung erstellt.",
        updated: "Buchung aktualisiert.",
      },
      userMgmt: {
        title: "Benutzer-Verwaltung",
        subtitle: "Verwalten Sie Benutzer und Rollen für das Studio.",
        users: "Benutzer",
        roles: "Rollen",
        addUser: "Neuer Benutzer",
        createRole: "Rolle erstellen",
        searchPlaceholder: "Schnellsuche...",
        filterAll: "Alles",
        filterActive: "Aktiv",
        filterAll: "Alles",
        filterActive: "Aktiv",
        newCustomer: "Neuer Benutzer",
        noUsers: "Keine Benutzer gefunden.",
        noRoles: "Keine Rollen vorhanden.",
        roleParentNone: "Eltern: Keine",
        roleDelete: "Löschen",
        table: {
          username: "Benutzername",
          firstname: "Vorname",
          lastname: "Nachname",
          roles: "Rollen",
          status: "Status",
          status: "Status",
          actions: "Aktionen",
          data: "Daten",
          addr: "Adr.",
          dob: "Geb.",
          type: "Typ",
          action: "Aktion"
        },
        roleEditor: {
          name: "Name",
          nameRequired: "Dieses Feld wird benötigt",
          rights: "Rechte",
          hierarchy: "Rollen Hierarchie",
          descInfo: "Hier wird die Beschreibung eines Rechts angezeigt.",
          cancel: "Abbrechen",
          save: "Speichern",
          placeholder: "Rollenname",
          permissions: {
            backOffice: "Back-Office",
            freetimeBooking: "Freizeitbuchung ohne Unterschrift",
            termination: "Kündigung verwalten ohne Unterschrift",
            userManagement: "Benutzerverwaltung",
            loginEdit: "Login bearbeiten",
            fullAccess: "Vollzugriff"
          }
        },
        wizard: {
          title: "Neuer Benutzer",
          steps: {
            select: "Person Auswählen",
            login: "Login erzeugen",
            roles: "Rollen hinzufügen",
            confirm: "Bestätigung"
          },
          fields: {
            firstname: "Vorname",
            lastname: "Nachname",
            customerNo: "Kundennummer",
            username: "Benutzername",
            password: "Passwort",
            locked: "Gesperrt",
            hidden: "Versteckt",
            changePwd: "Passwort ändern",
            strongPwd: "Passwort stark",
            centralLock: "Zentraler Login gesperrt"
          },
          roleSelect: {
            all: "Alle Rollen",
            active: "Aktive Rolle",
            error: "Bitte mindestens eine Rolle auswählen"
          },
          finish: {
            title: "Fertig!",
            desc: "Der Benutzer wurde erfolgreich angelegt."
          },
          buttons: {
            back: "Zurück",
            next: "Weiter",
            finish: "Abschließen",
            select: "Auswählen"
          }
        }
      },
    },

    /* ---------- Cabins Page ---------- */
    cabins: {
      cabin: {
        minLeft: "Min übrig",
        min: "Min",
      },
      unit: {
        seconds: "Sekunden"
      },
      dashboardMgmtTitle: "Geräte-Verwaltung",
      dashboardMgmtDesc: "Hier können Sie Geräte, Gerätecontroller, Gerätetypen und Wartungsarten erstellen oder bearbeiten.",
      dashboardMgmtBtn: "Geräte-Verwaltung",
      dashboardMgmtBtn: "Geräte-Verwaltung",
      dashboardGalleryTitle: "Geräte-Galerie",
      dashboardGalleryDesc: "Hier können Sie Bilder für bestimmte Geräte hochladen.",
      dashboardGalleryBtn: "Gerätebilder-Galerie",

      header: {
        kicker: "GERÄTEVERWALTUNG",
        title: "Kabinen & Geräte",
        subtitle: "Verwalte alle Studio-Kabinen, Kategorien, Gerätetypen und das Bild, das in der Empfangsübersicht angezeigt wird.",
        overview: "Übersicht",
      },
      tabs: {
        overview: "Geräteübersicht",
        types: "Gerätetypen",
        controller: "Gerätecontroller",
        maintenance: "Wartungsarten",
        management: "Kabine-Verwaltung",
        general: "Allgemein",
        technical: "Technisch",
      },
      types: {
        title: "Gerätetypen verwalten",
        subtitle: "Gültige Gerätetypen hinzufügen oder entfernen.",
        placeholder: "Neuer Typ-Name...",
        add: "+ Hinzufügen",
        deleteConfirm: "Typ \"{type}\" löschen?",
        select: "Gerätetyp auswählen",
        required: "Gerätetyp ist erforderlich"
      },
      controller: {
        title: "Controller-Konfiguration",
        subtitle: "Übersicht aller physischen Geräteverbindungen",
        viewAll: "Alle anzeigen",
        controllerType: "Steuerungstyp"
      },
      maintenance: {
        title: "Wartungsdefinitionen",
        fieldName: "Name",
        fieldDuration: "Dauer (Min)",
        placeholderName: "z.B. Filterwechsel",
        add: "Hinzufügen",
        fieldDuration: "Dauer (Min)",
        placeholderName: "z.B. Filterwechsel",
        add: "Hinzufügen",
        durationFormat: "{duration} Min Dauer",
        noDuration: "Keine feste Dauer",
        deleteConfirm: "Diese Wartungsart löschen?"
      },
      management: {
        title: "Globale Kabinenverwaltung",
        stopTitle: "Globaler Not-Halt",
        stopDesc: "Sofort alle laufenden Sitzungen stoppen und Status auf Fehler setzen.",
        stopConfirm: "SIND SIE SICHER? Dies stoppt ALLE Geräte sofort.",
        stopSuccess: "Not-Halt ausgeführt.",
        stopBtn: "NOT-HALT AUSLÖSEN",
        resetTitle: "Alle Controller zurücksetzen",
        resetDesc: "Alle Geräte auf 'Frei' setzen und Wartungsmodus deaktivieren.",
        resetConfirm: "Alle Geräte auf FREI zurücksetzen?",
        resetSuccess: "Systeme zurückgesetzt.",
        resetBtn: "Alle zurücksetzen",
        autoCleanTitle: "Standard Auto-Reinigung",
        autoCleanDesc: "Standard-Reinigungszeit für neue Geräte festlegen"
      },
      program: {
        title: "Geräteprogramm",
        subtitle: "Standardeinstellungen und Presets konfigurieren.",
        presets: {
          label: "Voreinstellung",
          standard: "Standard",
          sensitive: "Sensitiv",
          intensive: "Intensiv",
          custom: "Benutzerdefiniert"
        },
        settings: {
          intensity: "UV-Intensität",
          faceTanner: "Gesichtsbräuner",
          fanSpeed: "Lüftergeschwindigkeit",
          aroma: "Aroma",
          aquaMist: "Aqua Mist",
          airCon: "Klimaanlage",
          voiceGuide: "Voice Guide",
          targetTemp: "Ziel-Temp. (°C)"
        }
      },
      dashboardMgmtTitle: "Geräte-Verwaltung",
      dashboardMgmtDesc: "Hier können Sie Geräte, Gerätecontroller, Gerätetypen und Wartungsarten erstellen oder bearbeiten.",
      dashboardMgmtBtn: "Geräte-Verwaltung",
      dashboardGalleryTitle: "Gerätebilder-Galerie",
      dashboardGalleryDesc: "Hier können Sie Bilder für bestimmte Geräte hochladen.",
      dashboardGalleryBtn: "Gerätebilder-Galerie",
      actions: {
        restartController: "Gerätesteuerung neustarten",
        restartPeripheral: "Peripheriesteuerung neustarten",
        newDevice: "Neues Gerät",
        searchPlaceholder: "Schnellsuche...",
        filterAll: "Alles",
        filterDevices: "Alle Geräte",
        showHidden: "Auch ausgeblendete Geräte anzeigen",
        back: "Zurück",
        maintenanceReport: "Gerätewartungs-Bericht",
        usageReport: "Gerätenutzungs-Bericht",
      },

      table: {
        name: "Gerätename",
        type: "Gerätetypen",
        controller: "Gerätecontroller/Lokaler Port",
        deviceStatus: "Gerätestatus",
        articleVisible: "Artikel sichtbar",
        status: "Status",
        maintenanceStatus: "Wartungsstatus",
        actions: "Aktionen"
      },
      wizard: {
        steps: {
          data: "Gerätedaten",
          controller: "Gerätecontroller",
          maintenance: "Wartungen",
          program: "Geräteprogramm",
          confirm: "Bestätigung",
        },
        confirm: {
          title: "Bereit zum Speichern?",
          subtitle: "Bitte überprüfen Sie die Gerätedaten. Sie können zurückgehen, um Änderungen vorzunehmen.",
          name: "Name",
          type: "Typ",
          controller: "Controller",
          btnSave: "Speichern",
          saving: "Speichert..."
        },
        manufacturer: "Hersteller",
        deviceName: "Gerätename",
        deviceNumber: "Gerätenummer",
        deviceType: "Gerätetypen",
        description: "Beschreibung",
        powerTitle: "Bräunungsstärke",
        kw: "KW",
        joule: "Joule",
        uvStrength: "UV-Stärke",
        helpRequired: "Dieses Feld wird benötigt",
        enterManufacturer: "Hersteller eingeben",
        enterName: "Gerätename eingeben",
        enterNumber: "Gerätenummer eingeben",
        selectType: "Gerätetyp auswählen",
        enterDescription: "Beschreibung eingeben",
        basics: "Grundlegende Details",
      },
      errors: {
        load: "Kabinen konnten nicht vom Server geladen werden.",
        delete: "Kabine konnte nicht gelöscht werden.",
        generic: "Etwas ist schiefgelaufen.",
      },

      form: {
        editTitle: "Kabine bearbeiten",
        addTitle: "Neue Kabine hinzufügen",
        desc: "Lege Kabinen-Code, Gerätetyp und die Bild-URL fest, die im Haupt-Dashboard angezeigt wird.",
        cabinCode: "Kabinen-Code",
        cabinName: "Kabinenname",
        category: "Kategorie",
        deviceType: "Gerätetyp",
        statusDemo: "Status (Demo)",
        imageUrl: "Bild-URL",
        previewLabel: "Vorschau (Dashboard-Miniatur)",
        saving: "Speichern...",
        creating: "Erstellen...",
        saveChanges: "Änderungen speichern",
        addCabin: "Kabine hinzufügen",
        cancelEdit: "Bearbeiten abbrechen",
        autoCleanEnabled: "Auto-Reinigung nach Sitzung",
        autoCleanDuration: "Reinigungsdauer (Minuten)",
        leadTimeMinutes: "Vorlaufzeit (Minuten)",
        ipAddress: "IP-Adresse",
        macAddress: "MAC-Adresse",
        controllerType: "Controller-Typ",
        localPort: "Lokaler Port",
        externalPort: "Externer Port",
        preRunTime: "Vorlaufzeit",
        postRunTime: "Nachlaufzeit",
        deviceTypePlaceholder: "Gerätetyp wählen",
        pricingGroup: "Preisgruppe",
        pricingGroup: "Preisgruppe",
        startMaintenance: "Wartungsmodus starten",
        manufacturer: "Hersteller",
        deviceNumber: "Gerätenummer",
        description: "Beschreibung",
        powerStats: "Bräunungsstärke",
        kw: "KW",
        joule: "Joule",
        uvRating: "UV-Stärke",
        seconds: "Sekunden",
        specialDetails: "Details - Spezial",
        allowCalendar: "Kalender Buchungen erlauben",
        allowWebCalendar: "Web Kalender-Buchungen erlauben",
        allowApp: "Endkundenapp Kalender-Buchungen erlauben",
        hideDevice: "Gerät ausblenden",
        hideDeviceDesc: "Der Artikel wird aus der Kasse und Liste ausgeblendet",
        inOperation: "Gerät in Betrieb",
        selfService: "Verfügbar für Self-Service",
        cabinInfoText: "Kabinen Info-Text",
        showOnMonitor: "Auf externem Kunden-Monitor anzeigen",
        infoText: "Text",
        delete: "Löschen",
        confirmDelete: "Dieses Gerät löschen?",
        maintenanceHelp: "Gezwungener Wartungsmodus unabhängig vom Status",
        placeholders: {
          name: "z.B. Ergoline",
          number: "z.B. 22",
          imageUrl: "Oder Bild-URL manuell eingeben...",
          ip: "192.168.1.xxx",
          mac: "00:1B:44:11:3A:B7"
        },
      },
      maintenanceModal: {
        title: "Wartungsarten",
        name: "Name",
        interval: "Intervall",
        select: "Auswählen"
      },
      programTable: {
        title: "Programmübersicht",
        name: "Programm-Name",
        actions: "Aktionen",
        newProgram: "Neues Programm",
        empty: "Keine Daten stehen zur Verfügung!"
      },
      articleModal: {
        title: "Artikeldetails von {name}",
        tabs: {
          master: "Stammdaten",
          prices: "Preise"
        },
        masterData: {
          title: "Artikelstammdaten",
          edit: "Bearbeitung starten",
          org: "Organisation",
          revenue: "Erlöskonto",
          tax: "Besteuerungsart",
          group: "Warengruppe",
          name: "Artikelname",
          no: "Artikel-Nr.",
          desc: "Beschreibung",
          barcode: "Barcode"
        },
        special: {
          title: "Artikelstammdaten - Spezielle Optionen",
          security: "Rechtestufe",
          unit: "Einheit",
          freePrice: "Freie Preisgestaltung",
          maxPrice: "Maximalen Preis eingeben",
          negativePrice: "Negative Preise zulassen",
          hide: "Artikel ausblenden",
          hideAmounts: "Der Beträge ausblenden",
          stockable: "Lagerbar",
          specialFunc: "Sonderfunktion",
          staticRevenue: "Statischer Umsatz",
          requiredFile: "Benötigt Datei beim Kauf",
          validFrom: "Gültig von",
          validTo: "Gültig bis",
          yes: "Ja",
          no: "Nein",
          maxPricePlaceholder: ""
        },
        discount: {
          title: "Rabatt-Einstellungen",
          general: "Genereller Rabatt",
          manual: "Manueller Rabatt möglich?"
        },
        actions: {
          close: "Schließen",
          save: "Speichern"
        }
      },
      deviceTypes: {
        sunbed: "Solarium",
        hybrid: "Hybrid-Solarium",
        beauty: "Beauty / Collagen",
        bodyformer: "Bodyformer",
        other: "Sonstiges"
      },

      list: {
        title: "Alle Kabinen",
        loading: "Kabinen werden geladen...",
        configured: "{count} Kabine(n) konfiguriert",
        empty: "Noch keine Kabinen. Füge links deine erste Kabine hinzu.",
        infoHidden: "Die Geräte, deren Artikel ausgeblendet sind, werden in der Kasse und in der Geräteübersicht nicht angezeigt",
      },
      status: {
        free: "Frei",
        running: "Läuft",
        cleaning: "Reinigung",
        cleaned: "Gereinigt",
        error: "Fehler",
        maintenance: "Wartung",
      },

      card: {
        noCategory: "Keine Kategorie",
        edit: "Bearbeiten",
        delete: "Löschen",
        leadTime: "Vorlaufzeit",
        autoClean: "Auto-Clean",
      },
    },

    /* ---------- Reports Page ---------- */
    reports: {
      header: {
        kicker: "BERICHTE",
        title: "Nutzung & Umsatz",
        subtitle: "Einfacher Überblick über Kabinennutzung und Umsatz (Live-Daten basierend auf Buchungen).",
      },
      states: {
        loading: "Berichte werden geladen…",
        noBookingsLast7Days: "Keine Buchungen in den letzten 7 Tagen.",
      },
      kpi: {
        revenueToday: "Umsatz heute",
        revenueThisWeek: "Umsatz diese Woche",
        peakTimeToday: "Spitzenzeit heute",
      },
      kpiHelpers: {
        approxFromSessions: "Ca. aus Sitzungen",
        last7Days: "Letzte 7 Tage",
        mostActiveStartTime: "Aktivste Startzeit",
      },
      usage: {
        title: "Wöchentliche Kabinennutzung",
        basedOnLast7Days: "Basierend auf letzten 7 Tagen",
      },
      errors: {
        load: "Berichte konnten nicht geladen werden.",
        network: "Berichte konnten nicht geladen werden (Netzwerkfehler).",
      },
    },



    /* ---------- Pricing Page (Re-added - German) ---------- */
    pricing: {
      header: {
        kicker: "Globale Preise",
        title: "Preisverwaltung",
        subtitle: "Verwalten Sie Grundpreise und minutenweise Preise für alle Kabinen.",
      },
      loading: "Preise werden geladen...",
      cabin: {
        basePrice: "Grundpreis",
        perMin: "€ / Min",
        addMinutes: "+ Spezialminuten",
        minuteRows: "Minutenzeilen",
        min: "Min",
        save: "Speichern",
        saving: "Speichert...",
        delete: "Löschen",
        addNextMinute: "Neu (nächste Minute hinzufügen)",
        exportInfo: "Tipp: Export umfasst bis zu",
        minutes: "Minuten",
        pricePlaceholder: "Preis"
      },
      bulk: {
        selectBoards: "Boards wählen",
        selectAll: "Alle auswählen",
        selectNone: "Keine auswählen",
        refresh: "Aktualisieren",
        copyFrom: "Kopieren von (Quelle)",
        copyToSelected: "Auf gewählte kopieren",
        applySamePrice: "Grundpreis anwenden",
        apply: "Anwenden",
        exportExcel: "Excel Export",
        importExcel: "Excel Import",
        exportInfo: "Aktuelle Preise als .xlsx herunterladen",
        saving: "Speichern...",
        saveAll: "Alle speichern",
        copyTo: "Kopieren nach",
      },
      modal: {
        title: "Spezialpreis hinzufügen",
        desc: "Legen Sie einen benutzerdefinierten Preis für eine bestimmte Dauer fest.",
        placeholder: "Minute (z.B. 10)",
        cancel: "Abbrechen",
        add: "Hinzufügen",
      },
      excel: {
        minute: "Minute",
        cabin: "Kabine",
        basePrice: "Grundpreis (€/Min)",
        min: "Min",
      },
      message: {
        saved: "Preise erfolgreich gespeichert.",
        saveFailed: "Preise konnten nicht gespeichert werden.",
        copied: "Preise auf ausgewählte Kabinen kopiert.",
        exported: "Preise nach Excel exportiert.",
        imported: "Preise aus Excel importiert.",
        importFailed: "Excel-Import fehlgeschlagen.",
        loadFailed: "Preise konnten nicht geladen werden.",
        addMinutesError: "Ungültige Minute oder Preis.",
        addMinutesSuccess: "{count} Spezialpreis(e) hinzugefügt.",
      },
    },

    /* ---------- Customer (Singular: Form/Edit - German) ---------- */
    customer: {
      steps: {
        step1: "Stammdaten",
        step2: "Adresse",
        step3: "Kommunikation",
      },
      fields: {
        salutation: "Anrede",
        title: "Titel",
        firstName: "Vorname",
        lastName: "Nachname",
        birthDate: "Geburtsdatum",
        personNumber: "Personennummer",
        skinType: "Hauttyp",
        comment: "Kommentar",
        profileImage: "Profilbild",
        addressType: "Adresstyp",
        street: "Straße",
        zipCode: "PLZ",
        city: "Stadt",
        country: "Land",
        phone: "Telefon",
        mobile: "Mobil",
        email: "E-Mail",
      },
      placeholders: {
        street: "Straße",
        houseNumber: "Nr.",
      },
      options: {
        mr: "Herr",
        mrs: "Frau",
        ms: "Frl.",
        type1: "Typ 1",
        type2: "Typ 2",
        type3: "Typ 3",
        type4: "Typ 4",
        type5: "Typ 5",
        type6: "Typ 6",
        postal: "Postanschrift",
        billing: "Rechnungsadresse",
        germany: "Deutschland",
        austria: "Österreich",
        switzerland: "Schweiz",
      },
      hints: {
        imageUpload: "Unbegrenzte Größe. Formate: PNG, JPG.",
      },
      addressHint: "Hier können Sie die für den Mitgliedsvertrag erforderliche Postanschrift eingeben.",
      selectOption: "Wählen...",
      cancel: "Abbrechen",
      back: "Zurück",
      next: "Weiter",
      create: "Kunde erstellen",
      creating: "Speichern...",
      confirmDelete: "Möchten Sie diesen Kunden wirklich löschen?",
      createdError: "Kunde konnte nicht gespeichert werden",
    },

    /* ---------- Customers Page (List - German) ---------- */
    customers: {
      header: {
        title: "Kundenliste",
        subtitle: "Verwalten Sie Ihre Kundenbeziehungen.",
      },
      addCustomer: "Kunde hinzufügen",
      searchPlaceholder: "Name oder E-Mail suchen...",
      states: {
        loading: "Kunden werden geladen...",
        empty: "Keine Kunden in der Datenbank.",
        noResults: "Keine Kunden für Ihre Suche gefunden.",
      },
      steps: {
        step1: "Stammdaten",
        step2: "Adresse",
        step3: "Kommunikation",
      },
      fields: {
        salutation: "Anrede",
        title: "Titel",
        firstName: "Vorname",
        lastName: "Nachname",
        birthDate: "Geburtsdatum",
        personNumber: "Personennummer",
        skinType: "Hauttyp",
        comment: "Kommentar",
        profileImage: "Profilbild",
        addressType: "Adresstyp",
        street: "Straße",
        zipCode: "PLZ",
        city: "Stadt",
        country: "Land",
        phone: "Telefon",
        mobile: "Mobil",
        email: "E-Mail",
        lastVisit: "Letzter Besuch",
        noContact: "Keine Kontaktinfo",
      },
      placeholders: {
        street: "Straße",
        houseNumber: "Nr.",
      },
      options: {
        mr: "Herr",
        mrs: "Frau",
        ms: "Frl.",
        type1: "Typ 1",
        type2: "Typ 2",
        type3: "Typ 3",
        type4: "Typ 4",
        type5: "Typ 5",
        type6: "Typ 6",
        postal: "Postanschrift",
        billing: "Rechnungsadresse",
        germany: "Deutschland",
        austria: "Österreich",
        switzerland: "Schweiz",
      },
      hints: {
        imageUpload: "Unbegrenzte Größe. Formate: PNG, JPG.",
      },
      addressHint: "Hier können Sie die für den Mitgliedsvertrag erforderliche Postanschrift eingeben.",
      selectOption: "Wählen...",
      cancel: "Abbrechen",
      back: "Zurück",
      next: "Weiter",
      create: "Kunde erstellen",
      creating: "Speichern...",
      confirmDelete: "Möchten Sie diesen Kunden wirklich löschen?",
      createdError: "Kunde konnte nicht gespeichert werden",
      errors: {
        firstNameRequired: "Vorname ist erforderlich",
        lastNameRequired: "Nachname ist erforderlich",
        communicationRequired: "Mindestens eine Kontaktmethode ist erforderlich",
      },
    },

    /* ---------- Settings Page (German) ---------- */
    settings: {
      loading: "Einstellungen laden...",
      error: "Einstellungen konnten nicht geladen werden.",
      errorGeneric: "Ein unerwarteter Fehler ist aufgetreten.",
      header: {
        kicker: "SYSTEM",
        title: "Systemeinstellungen",
        subtitle: "Verwalten Sie Ihr Studio-Profil und Gerätekonfigurationen.",
        liveConfig: "Live-Konfig",
      },
      studioProfile: {
        title: "Studio-Profil",
        description: "Allgemeine Informationen zu Ihrem Standort.",
        fields: {
          studioName: "Studio Name",
          city: "Stadt",
          phone: "Telefon",
          email: "E-Mail",
        },
      },
      deviceGroups: {
        title: "Gerätegruppen",
        description: "Gruppierte Kabinenkonfigurationen.",
        devices: "{count} Gerät(e)",
      },
      userAccounts: {
        title: "Benutzerkonten",
        description: "Registrierte Systembenutzer und Rollen.",
        roleAdmin: "Administrator",
        roleReception: "Empfang",
        adminDesc: "Vollzugriff auf alle Einstellungen",
        receptionDesc: "Eingeschränkter Zugriff auf Dashboard",
        rbacInfo: "Rollenbasierte Zugriffskontrolle ist aktiv.",
      },
    },

    /* ---------- User Management (German) ---------- */
    users: {
      title: "Benutzer-Verwaltung",
      subTitle: "MANDANTENGRUPPE: SONNE0542",
      tabs: {
        users: "Benutzer",
        roles: "Rollen",
      },
      list: {
        searchPlaceholder: "Schnellsuche...",
        newUser: "+ Neuer Benutzer",
        showHidden: "Auch versteckte Logins anzeigen",
        columns: {
          username: "Benutzername",
          name: "Vorname",
          surname: "Nachname",
          roles: "Rollen",
          status: "Status",
          actions: "Aktionen",
        },
        status: {
          active: "Aktiv",
          inactive: "Inaktiv",
        },
        loading: "Benutzer werden geladen...",
        empty: "Keine Benutzer in der Datenbank gefunden.",
      },
      roles: {
        createTitle: "Rolle erstellen",
        editTitle: "Rolle bearbeiten",
        btnCancel: "Abbrechen",
        btnSave: "Speichern",
        fieldRequired: "Dieses Feld ist erforderlich",
        nameLabel: "Name",
        overview: "Rollen Übersicht",
        parent: "ÜBERGEORDNET",
        none: "KEINE",
        tabs: {
          rights: "Rechte",
          hierarchy: "Rollen Hierarchie",
        },
        hierarchy: {
          allRoles: "Alle Rollen",
          parentRoles: "Übergeordnete Rollen",
        },
        rights: {
          showHidden: "Versteckte Rechte anzeigen",
          filter: "Filtern...",
          description: "Die Beschreibung eines Rechts wird hier angezeigt. Wählen Sie das Recht aus oder klicken Sie auf den Namen.",
        }
      },
      errors: {
        saveUser: "Benutzer konnte nicht gespeichert werden",
        saveRole: "Rolle konnte nicht gespeichert werden",
      },
      wizard: {
        title: "Neuer Benutzer",
        step: "Schritt",
        steps: {
          person: "Person Auswählen",
          login: "Login erzeugen",
          roles: "Rollen hinzufügen",
          confirm: "Bestätigung",
        },

        btnNext: "Weiter",
        btnBack: "Zurück",
        btnSave: "Speichern",
        searchPerson: "Schnellsuche...",
        login: {
          username: "Benutzername",
          password: "Passwort (leer lassen für keine Änderung)",
          passwordRepeat: "Passwort wiederholen",
          generated: "Passwort generieren",
          matchError: "Passwörter stimmen nicht überein",
          customerData: "Kundendaten",
          address: "Adresse",
          dob: "Geburtsdatum",
          tags: "Tags",
          type: "Typ",
          locked: "Gesperrt",
          hidden: "Versteckt",
          changePwdOnLogin: "Passwort bei Login ändern",
          pwdStrong: "Starkes Passwort",
          centralLoginLocked: "Zentraler Login gesperrt",
          fieldRequired: "Dieses Feld wird benötigt",
          firstName: "Vorname",
          lastName: "Nachname",
          customerNumber: "Kunden-Nr.",
          generatedHint: "(Automatisch beim Speichern generiert)",
        },
        roleAssign: {
          allRoles: "Alle Rollen",
          activeRoles: "Aktive Rolle",
          oneActiveLimit: "Nur ein aktives Objekt darf gesetzt werden!",
          selectOne: "Bitte mindestens eine Rolle auswählen.",
        },
        confirm: {
          title: "Bereit zum Speichern?",
          subtitle: "Benutzer {user} wird mit {count} Rollen gespeichert.",
          status: "Status",
          roles: "Rollen",
          password: "Passwort",
          locked: "Gesperrt",
          active: "Aktiv",
          set: "Gesetzt",
          unchanged: "Wie vorher",
        },
        login: {
          username: "Benutzername",
          password: "Passwort (leer lassen zum Beibehalten)",
          passwordRepeat: "Passwort wiederholen",
          generated: "Passwort generieren",
          matchError: "Passwörter stimmen nicht überein",
          customerData: "Kundendaten",
          address: "Adresse",
          dob: "Geburtsdatum",
          tags: "Tags",
          type: "Typ",
          locked: "Gesperrt",
          hidden: "Versteckt",
          changePwdOnLogin: "Passwort bei Anmeldung ändern",
          pwdStrong: "Passwort stark",
          centralLoginLocked: "Zentraler Login gesperrt",
          fieldRequired: "Dieses Feld wird benötigt",
          firstName: "Vorname",
          lastName: "Nachname",
          customerNumber: "Kundennummer",
          generatedHint: "(Wird beim Speichern generiert)",
        },
      },
    },

    /* ---------- Article Management (New German) ---------- */
    article: {
      steps: {
        step1: "Artikel erstellen (1)",
        step2: "Artikel erstellen (2)",
        step3: "Preise hinzufügen",
        step4: "Bestätigung",
      },
      headers: {
        addArticleData: "Artikeldaten hinzufügen",
      },
      fields: {
        organization: "Organisation",
        revenueAccount: "Erlöskonto",
        taxType: "Besteuerungsart",
        productGroup: "Warengruppe",
        articleName: "Artikelname",
        articleNo: "Artikel-Nr.",
        description: "Beschreibung",
        barcode: "Barcode",
        unit: "Einheit",
        allowFreePrice: "Freie Preisgestaltung zulassen",
        allowNegativePrice: "Negative Preise zulassen",
        hideAmount: "Der Beträge ausblenden",
        specialFunction: "Sonderfunktion",
        fileRequired: "Benötigt Datei beim Kauf",
        validPeriod: "Einen gültigen Zeitraum auswählen?",
        generalDiscount: "Genereller Rabatt",
        stockable: "Lagerbar",
        statisticalSales: "Statischer Umsatz",
      },
      categories: {
        cabins: "KABINEN",
        cosmetics: "KOSMETIK",
        drinks: "GETRÄNKE",
        cards: "WERTKARTEN",
        hygiene: "HYGIENE ARTIKEL",
        groupon: "GROUPON",
        vouchers: "GUTSCHEIN VERKAUF",
        counter: "GEGENBUCHUNG",
        others: "SONSTIGE",
        cancellation: "SONDERKÜNDIGUNG",
      },
      filter: {
        all: "Alles",
      },
      groups: {
        header: "Artikelgruppen-Verwaltung",
        createTitle: "Artikelgruppe erstellen",
        fields: {
          name: "Bezeichnung",
          org: "Organisation",
          parent: "Zugeordnet bei",
          desc: "Beschreibung",
          showInPos: "In Kasse anzeigen?",
          manualDiscount: "Manueller Rabatt möglich?",
          color: "Farbe",
          colorSelection: "Farbauswahl",
          owner: "Eigentümer",
          order: "Sortierung",
        },
        stockTaking: {
          title: "Bestandszählung",
          entry: "Bestand eintragen",
          review: "Bestand abgleichen",
          correct: "Bestand korrigieren",
          report: "Bericht",
          info: "Die Artikel, die mit einem Barcode versehen sind, können gescannt werden.",
          currentStock: "Aktueller Bestand",
          newStock: "Neuer Bestand",
          protocol: "Bestandsprotokoll anzeigen",
          confirm: "Bericht bestätigen",
          cancel: "Abbrechen",
          back: "Zur vorherigen Ansicht",
          start: "Alles korrigieren",
          showHidden: "Auch ausgeblendete Artikel anzeigen",
          lastCount: "Letzte Zählung",
          difference: "Differenz"
        },
        buttons: {
          listArticles: "Artikel listen",
          edit: "Bearbeiten",
          delete: "Löschen",
        },
      },
      settings: {
        rightsLevel: "Rechtestufe",
        unitSelection: "Einheit auswählen",
        units: {
          piece: "Stückzahl",
          time: "Zeit"
        },
        allowFreePrice: "Freie Preisgestaltung zulassen",
        allowNegativePrice: "Negative Preise zulassen",
        hideAmount: "Beträge ausblenden",
        specialFunction: "Sonderfunktion",
        fileRequired: "Benötigt Datei beim Kauf",
        validPeriod: "Einen gültigen Zeitraum auswählen?",
        generalDiscount: "Genereller Rabatt",
        stockable: "Lagerbar",
        statisticalSales: "Statischer Umsatz",
        functions: {
          none: "Keine",
          contingent: "Erstellen eines Kontingents",
          emptyBooking: "Erstelle leere Buchung bei Storno",
          module: "Module",
          device: "Aktiviert ein Gerät"
        }
      },
      pricing: {
        header: "Preisliste bearbeiten",
        selectCurrency: "Währung auswählen",
        fixedUnitSize: "Feste Einheitsgröße",
        unit: "Maßeinheit",
        price: "Preis",
        addPrice: "Preis hinzufügen",
        removePrice: "Preis entfernen"
      },
      inventory: {
        header: "Lager-Verwaltung",
        listTitle: "Bestandsübersicht",
        active: "Aktiv",
        min: "Minimum (Meldeschwelle)",
        max: "Maximum (Maximalbestand)",
        stock: "Bestand",
        lastCount: "Letzte Zählung",
        diff: "Differenz",
        settings: "Lager-Verwaltung",
        booking: "Lagerbuchung tätigen",
        journal: "Lagerjournal (Zu- und Abgänge)",
        actions: {
          bookIn: "Einbuchen",
          bookOut: "Ausbuchen",
          correction: "Korrektur"
        },
        fields: {
          amount: "Anzahl",
          date: "Buchungsdatum",
          remark: "Bemerkung",
          user: "Benutzer",
          action: "Aktion",
          before: "Vorher",
          movement: "Bewegung",
          after: "Nachher"
        },
        messages: {
          saved: "Einstellungen gespeichert!",
          booked: "Buchung erfolgreich!",
          error: "Fehler bei der Verarbeitung",
          reason: "Grund für Buchung...",
          noChanges: "Keine Änderungen zum Speichern."
        }
      },
      list: {
        viewAll: "Alle Artikel anzeigen",
        searchPlaceholder: "Schnellsuche...",
        newArticle: "Neuer Artikel",
        cart: "Warenkorb",
        empty: "Leeren",
        noArticles: "Keine Artikel im Warenkorb",
        shortcuts: "Tastaturkürzel",
      },
      placeholders: {
        articleName: "Bitte Artikelname eingeben",
        articleNo: "Bitte Artikel-Nr. eingeben",
      },
      messages: {
        fieldRequired: "Dieses Feld wird benötigt",
        generate: "generieren",
        captureBarcode: "Barcode erfassen",
        back: "zurück",
        next: "weiter",
        abort: "Abbrechen",
        save: "Speichern",
        confirmDelete: "Sind Sie sicher, dass Sie diesen Artikel löschen möchten?",
        backToOverview: "Zurück zur Übersicht",
      },
      options: {
        select: "Option auswählen",
        piece: "Stückzahl",
        time: "Zeit",
        none: "Keine",
        yes: "Ja",
        yes: "Ja",
        no: "Nein",
        allArticles: "Alle Artikel",
        rightsLevel0: "Rechtestufe 0",
        rightsLevel1: "Rechtestufe 1",
        tax19: "19% MwSt",
        tax7: "7% MwSt",
        revenueAcc8400: "8400 (Umsatzerlöse (Studio) 19%)",
        currencyEur: "EUR / €",
        checkout: "Kasse",
        paymentMethod: "Zahlungsmethode",
        cash: "Bar",
        card: "EC-Karte",
        confirmPayment: "Zahlung abschließen",
        totalToPay: "Gesamt",
        paymentSuccess: "Zahlung erfolgreich",
        vatIncluded: "inkl. {rate}% MwSt.",
      },
      dashboard: {
        articles: { title: "Artikel erstellen und bearbeiten", desc: "Hier können Sie Artikel erstellen und bearbeiten und andere Optionen hinzufügen (z.B. die Preise für Artikel)." },
        groups: { title: "Artikelgruppen erstellen und bearbeiten", desc: "Hier können Sie Artikelgruppen erstellen und bearbeiten." },
        stock: { title: "Lager-Verwaltung", desc: "Hier können Sie Lagerbuchung für Artikel tätigen, Lieferanten und Lagerbewegungen anschauen." },
        contingents: { title: "Artikel-Kontingente verwalten", desc: "Hier können Sie Artikel-Kontingente erstellen und bearbeiten." },
        units: { title: "Artikeleinheiten verwalten", desc: "Hier können Sie Artikeleinheiten erstellen und bearbeiten." },
        inventory: { title: "Bestandszahlung", desc: "Hier können Sie Ihre Inventur aller lagerbaren Artikel durchführen." },
        pricing: { title: "Preisvereinbarungen", desc: "Hier können Sie Artikel individuelle Preise zuteilen, diese Zuteilung unter einen Namen speichern und den Kunden zur Verfügung stellen." }
      },
      units_management: {
        header: "Einheiten-Verwaltung",
        createTitle: "Neue Einheit erstellen",
        editTitle: "Einheit bearbeiten",
        fields: {
          name: "Einheiten-Name (z.B. Stück)",
          code: "Kürzel (z.B. stk)"
        },
        save: "Einheit speichern",
        delete: "Einheit löschen",
        confirmDelete: "Diese Einheit löschen?"
      },
      groups: {
        header: "Artikelgruppen-Verwaltung",
        createTitle: "Artikelgruppe erstellen",
        fields: {
          name: "Bezeichnung",
          org: "Organisation",
          parent: "Zugeordnet bei",
          desc: "Beschreibung",
          showInPos: "In Kasse anzeigen?",
          manualDiscount: "Manueller Rabatt möglich?",
          color: "Farbe",
          colorSelection: "Farbauswahl",
          owner: "Eigentümer",
          order: "Reihenfolge"
        },
        buttons: {
          listArticles: "Liste der zugewiesenen Artikel",
          add: "Hinzufügen",
          edit: "Bearbeiten",
          delete: "Löschen"
        },
        stockTaking: {
          title: "Bestandszahlung Wizard",
          entry: "Vorhandenen Bestand eintragen",
          review: "Bericht",
          correct: "Korrektur",
          infoStep1: "Die Artikel, die mit einem Barcode versehen sind, können gescannt werden. Im Anschluss kann in einem Popup ihre Bestandsanzahl eingegeben werden.",
          infoStep2: "Die Artikel, die mit einem Barcode versehen sind, können gescannt werden. Im Anschluss kann in einem Popup eine Bemerkung eingegeben werden.",
          viewProtocol: "Bestandsprotokoll anzeigen",
          confirmReport: "Bericht bestätigen",
          backToView: "Zur vorherigen Ansicht",
          backToStep: "Zum vorherigen Schritt",
          back: "Zurück",
          cancel: "Abbrechen",
          next: "weiter",
          confirm: "weiter ->",
          currentStock: "Aktueller Bestand",
          newStock: "Neuer Bestand",
          difference: "Differenz",
          showHidden: "Versteckte Artikel anzeigen",
          status: "Status",
          articleNo: "Art-Nr",
          articleName: "Art-Name",
          articleGroup: "Art-Gruppe",
          remark: "Bemerkung",
          start: "Bestandszählung starten",
          lastCount: "Letzte Zählung",
          remarkPlaceholder: "Bitte Grund eingeben"
        }
      },
      contingents: {
        header: "Artikel-Kontingent-Übersicht",
        createTitle: "Neues Artikel-Kontingent erstellen",
        sections: {
          basicData: "Grunddaten",
          trigger: "Kontingent-Erstellungs-Trigger",
          usableArticles: "Nutzbare Artikel"
        },
        fields: {
          designation: "Bezeichnung",
          org: "Organisation",
          currency: "Währung",
          accountType: "Konten-Typ",
          priority: "Abbuchungspriorität",
          validity: "Gültigkeitsdauer",
          article: "Artikel",
          quotaType: "Kontingent-Art"
        },
        labels: {
          allArticles: "Alle Artikel"
        },
        options: {
          select: "Option auswählen",
          passiveIndex: "Sachkonto (Passiv)",
          activeIndex: "Sachkonto (Aktiv)",
          creditor: "Personenkonto Lieferanten (Creditor)",
          debitor: "Personenkonto Kunden (Debitor)",
          highest: "am höchsten",
          high: "hoch",
          normal: "normal",
          low: "niedrig",
          lowest: "am niedrigsten",
          year: "Jahr",
          years: "Jahre",
          months: "Monate",
          days: "Tage",
          fixedValue: "fester Wert",
          byQuantity: "aus Anzahl",
          byPrice: "aus Preis",
          voucher: "Gutschein"
        },
        buttons: {
          add: "Kontingent hinzufügen",
          save: "Speichern",
          back: "zurück zur Übersicht",
          details: "Details",
          delete: "Löschen",
          select: "Auswählen"
        },
        errors: {
          required: "Dieses Feld wird benötigt"
        }
      },
    },
    priceAgreement: {
      title: "Preisvereinbarung-Verwaltung",
      createTitle: "Preisvereinbarung hinzufügen",
      editTitle: "Preisvereinbarung '{name}' bearbeiten",
      new: "Neu",
      back: "zurück zur Übersicht",
      startEdit: "Bearbeitung starten",
      delete: "Preisvereinbarung löschen",
      confirmDelete: "Sind Sie sicher, dass Sie diese Preisvereinbarung löschen möchten?",
      copy: "Kopieren",
      copyWarning: "Kopieren ist die bessere Alternative!",
      copyMessage: "Es wird nicht empfohlen, eine neue Preisvereinbarung von Grund auf zu erstellen! Die alten Preise stehen nicht mehr zur Verfügung, wenn Tarife zu dieser Preisvereinbarung in Zukunft verlängert werden. Sie sollten stattdessen eine neue Preisvereinbarung erstellen, indem Sie die aktuelle Standard-Preisvereinbarung oder die zentrale Dummy-Preisvereinbarung kopieren.",
      proceed: "Trotzdem fortfahren",
      cancel: "Absagen",
      fields: {
        name: "Preisvereinbarung-Name",
        description: "Beschreibung",
        isStandard: "Als Standard setzen",
        isHidden: "Verstecken",
        changeOnContract: "Wechsel bei Vertragswechsel",
        changeOnContract_short: "Vertragswechsel",
        changeOnExtension: "Wechsel bei Vertragsverlängerung",
        changeOnExtension_short: "Verlängerung",
        validFrom: "Gültig von",
        validTo: "Gültig bis",
        priority: "Priorität"
      },
      tabs: {
        basic: "Grunddaten",
        articles: "Zugeordnete Artikel",
        persons: "Zugeordnete Personen"
      },
      articles: {
        add: "Artikel hinzufügen",
        filter: "Filter: {count} Optionen ausgewählt",
        price: "Art-Preis",
        status: "Status",
        noArticles: "Keine Artikel zugeordnet.",
        selectArticle: "Artikel auswählen",
        searchPlaceholder: "Artikel suchen...",
        group: "Art-Gruppe",
        removeConfirm: "Diesen Artikel entfernen?"
      },
      persons: {
        add: "Person hinzufügen",
        addTitle: "Person hinzufügen",
        select: "Person auswählen",
        manage: "Zuordnung verwalten",
        customerData: "Kundendaten",
        birthDate: "Geburtsdatum",
        noPersons: "Keine Personen zugeordnet.",
        changePriority: "Priorität ändern",
        removeConfirm: "Diese Person entfernen?"
      },
      save: "Speichern",
      errors: {
        required: "Dieses Feld ist erforderlich",
        articleExists: "Artikel bereits zugeordnet",
        personExists: "Person bereits zugeordnet"
      },
      success: {
        articleAdded: "Artikel erfolgreich hinzugefügt",
        personAdded: "Person erfolgreich hinzugefügt",
        articleRemoved: "Artikel erfolgreich entfernt",
        personRemoved: "Person erfolgreich entfernt",
        copied: "Erfolgreich kopiert",
        saved: "Erfolgreich gespeichert",
        deleted: "Erfolgreich gelöscht"
      }
    }

  }
};

export const t = (lang, key, vars) => {
  const dict = translations[lang] || translations.en;
  const val = key.split(".").reduce((acc, k) => (acc ? acc[k] : null), dict) || key;
  if (!vars || typeof val !== "string") return val;
  return Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), val);
};

export const trDynamic = (lang, value) => {
  if (!value) return value;
  const map = {
    "In use": "cabin.inUse",
    "No active customer": "cabin.noActiveCustomer",
    "Walk-in": "misc.walkIn",
    "None": "misc.none",
  };
  const k = map[value];
  return k ? t(lang, k) : value;
};
