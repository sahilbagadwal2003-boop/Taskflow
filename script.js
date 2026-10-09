/**
 * TASKFLOW - Application Logic
 * Streamlined workflow visualization with single action button
 */

(function () {
  'use strict';

  // Workflow stage sequence
  const STAGES = ['backlog', 'in_progress', 'review', 'completed'];

  const STAGE_LABELS = {
    backlog: 'Assigned',
    in_progress: 'In Progress',
    review: 'Review',
    completed: 'Completed'
  };

  const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #a855f7)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  ];

  // DOM Elements
  const flowInput = document.getElementById('flowInput');
  const addBtn = document.getElementById('addBtn');
  const totalCountEl = document.getElementById('totalCount');
  const activeCountEl = document.getElementById('activeCount');
  const completedCountEl = document.getElementById('completedCount');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressBarFill = document.getElementById('progressBarFill');

  const columnContainers = {
    backlog: document.getElementById('items-backlog'),
    in_progress: document.getElementById('items-in_progress'),
    review: document.getElementById('items-review'),
    completed: document.getElementById('items-completed')
  };

  const badgeCounts = {
    backlog: document.getElementById('badge-backlog'),
    in_progress: document.getElementById('badge-in_progress'),
    review: document.getElementById('badge-review'),
    completed: document.getElementById('badge-completed')
  };

  // State
  let items = loadItems();

  /**
   * Load initial data from localStorage or create starter items
   */
  function loadItems() {
    const saved = localStorage.getItem('taskflow_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved taskflow items', e);
      }
    }

    // Default sample flow items if first visit
    return [
      {
        id: 'TF-101',
        title: 'Alice Morgan (Design System Lead)',
        stage: 'in_progress',
        createdAt: '10:15 AM',
        gradient: AVATAR_GRADIENTS[0]
      },
      {
        id: 'TF-102',
        title: 'Backend API Authentication Endpoint',
        stage: 'review',
        createdAt: '11:30 AM',
        gradient: AVATAR_GRADIENTS[1]
      },
      {
        id: 'TF-103',
        title: 'Marcus Vance (DevOps Engineer)',
        stage: 'completed',
        createdAt: '09:00 AM',
        gradient: AVATAR_GRADIENTS[2]
      },
      {
        id: 'TF-104',
        title: 'Optimize Database Query Indexes',
        stage: 'backlog',
        createdAt: '12:00 PM',
        gradient: AVATAR_GRADIENTS[3]
      }
    ];
  }

  /**
   * Save items to localStorage
   */
  function saveItems() {
    localStorage.setItem('taskflow_items', JSON.stringify(items));
  }

  /**
   * Extract initials for avatar representation
   */
  function getInitials(text) {
    if (!text) return 'TF';
    const words = text.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /**
   * Add a new item from input (or smart fallback if empty)
   */
  function handleAddItem() {
    const rawVal = flowInput.value.trim();
    const title = rawVal || `User / Input #${items.length + 1}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomGradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];

    const newItem = {
      id: `TF-${Math.floor(100 + Math.random() * 900)}`,
      title: title,
      stage: 'backlog',
      createdAt: timeStr,
      gradient: randomGradient
    };

    items.unshift(newItem);
    saveItems();
    render();

    // Reset and keep focus
    flowInput.value = '';
    flowInput.focus();
  }

  /**
   * Advance item to next stage on click
   */
  function advanceItem(id) {
    const itemIndex = items.findIndex(function (it) {
      return it.id === id;
    });

    if (itemIndex === -1) return;

    const currentStageIndex = STAGES.indexOf(items[itemIndex].stage);
    const nextStageIndex = (currentStageIndex + 1) % STAGES.length;

    items[itemIndex].stage = STAGES[nextStageIndex];
    saveItems();
    render();
  }

  /**
   * Remove item on double click
   */
  function removeItem(id) {
    items = items.filter(function (it) {
      return it.id !== id;
    });
    saveItems();
    render();
  }

  /**
   * Update metrics and summary statistics
   */
  function updateStats() {
    const total = items.length;
    const inProgress = items.filter(function (it) {
      return it.stage === 'in_progress';
    }).length;
    const completed = items.filter(function (it) {
      return it.stage === 'completed';
    }).length;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalCountEl.textContent = total;
    activeCountEl.textContent = inProgress;
    completedCountEl.textContent = completed;
    progressPercentEl.textContent = percent + '%';
    progressBarFill.style.width = percent + '%';

    // Update column count badges
    STAGES.forEach(function (stage) {
      const count = items.filter(function (it) {
        return it.stage === stage;
      }).length;
      if (badgeCounts[stage]) {
        badgeCounts[stage].textContent = count;
      }
    });
  }

  /**
   * Render all columns and cards
   */
  function render() {
    // Clear all columns
    STAGES.forEach(function (stage) {
      if (columnContainers[stage]) {
        columnContainers[stage].innerHTML = '';
      }
    });

    // Populate items
    items.forEach(function (item) {
      const targetColumn = columnContainers[item.stage];
      if (!targetColumn) return;

      const card = document.createElement('div');
      card.className = 'flow-card';
      card.setAttribute('data-stage', item.stage);
      card.setAttribute('title', 'Click to advance stage • Double click to remove');

      // Next stage hint text
      const nextStage = STAGES[(STAGES.indexOf(item.stage) + 1) % STAGES.length];
      const nextLabel = STAGE_LABELS[nextStage];

      card.innerHTML = `
        <div class="card-top">
          <div class="user-badge">
            <div class="avatar" style="background: ${item.gradient}">${getInitials(item.title)}</div>
            <span class="item-id">${item.id}</span>
          </div>
          <span class="stage-pill pill-${item.stage}">
            ${STAGE_LABELS[item.stage]}
          </span>
        </div>
        <div class="card-title">${escapeHtml(item.title)}</div>
        <div class="card-footer">
          <span>${item.createdAt}</span>
          <span class="advance-hint">Move to ${nextLabel} &rarr;</span>
        </div>
      `;

      // Single click advances stage
      card.addEventListener('click', function (e) {
        advanceItem(item.id);
      });

      // Double click deletes item
      card.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        removeItem(item.id);
      });

      targetColumn.appendChild(card);
    });

    // Add empty placeholder if column has no items
    STAGES.forEach(function (stage) {
      const col = columnContainers[stage];
      if (col && col.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-placeholder';
        placeholder.textContent = 'No items in this stage';
        col.appendChild(placeholder);
      }
    });

    updateStats();
  }

  /**
   * Basic HTML sanitization for safe rendering
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  // Single action button to add user/input
  addBtn.addEventListener('click', handleAddItem);

  // Enter key in input field
  flowInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  });

  // Initial render
  render();
})();
