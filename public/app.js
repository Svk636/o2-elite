// ============================================
// O2 ELITE - ZEN PRODUCTIVITY SYSTEM
// Version 2.0 - Production Ready
// ============================================

// SUPABASE CONFIGURATION
// ============================================
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Your anon/public key

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let currentTab = 'dashboard';
let currentFocusTab = 'execute';
let currentVaultFilter = 'all';
let syncStatus = 'synced'; // synced, syncing, error

// ============================================
// AUTHENTICATION
// ============================================

// Check for existing session on load
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        showApp();
        loadDashboardData();
    } else {
        showAuth();
    }
}

// Sign Up
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpPasswordConfirm').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        alert('Sign up successful! Please check your email to verify your account.');
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Sign In
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        currentUser = data.user;
        showApp();
        loadDashboardData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Password Reset
document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) throw error;

        alert('Password reset link sent to your email!');
        document.getElementById('backToSignIn').click();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Sign Out
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        currentUser = null;
        showAuth();
    } catch (error) {
        alert('Error signing out: ' + error.message);
    }
}

// Show/Hide containers
function showAuth() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
}

// Auth tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(`${tabName === 'signin' ? 'signIn' : 'signUp'}Form`).classList.add('active');
    });
});

document.getElementById('resetPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('resetPasswordForm').classList.add('active');
});

document.getElementById('backToSignIn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('signInForm').classList.add('active');
});

// ============================================
// NAVIGATION
// ============================================

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'dashboard') loadDashboardData();
    if (tabName === 'focus') loadFocusData();
    if (tabName === 'build') loadGoalsData();
    if (tabName === 'labs') loadLabsData();
    if (tabName === 'vault') loadVaultData();
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        switchTab(tabName);
    });
});

// Focus sub-tabs
document.querySelectorAll('.focus-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const focusTabName = e.target.dataset.focusTab;
        currentFocusTab = focusTabName;
        
        document.querySelectorAll('.focus-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.focus-pane').forEach(p => p.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(focusTabName).classList.add('active');
        
        if (focusTabName === 'execute') loadExecuteMode();
        if (focusTabName === 'schedule') loadScheduleMode();
    });
});

// ============================================
// UNIVERSAL CAPTURE
// ============================================

const captureModal = document.getElementById('captureModal');
const captureBtn = document.getElementById('universalCapture');
const captureForm = document.getElementById('quickCaptureForm');
const captureTypeGrid = document.querySelector('.capture-type-grid');

captureBtn.addEventListener('click', () => {
    captureModal.classList.add('show');
});

captureModal.querySelector('.close-btn').addEventListener('click', () => {
    captureModal.classList.remove('show');
    captureForm.style.display = 'none';
    captureTypeGrid.style.display = 'grid';
});

document.querySelectorAll('.capture-type-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        document.getElementById('captureItemType').value = type;
        captureTypeGrid.style.display = 'none';
        captureForm.style.display = 'block';
        document.getElementById('captureTitle').focus();
    });
});

document.getElementById('captureCancelBtn').addEventListener('click', () => {
    captureForm.style.display = 'none';
    captureTypeGrid.style.display = 'grid';
    captureForm.reset();
});

captureForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('captureItemType').value;
    const title = document.getElementById('captureTitle').value;
    const content = document.getElementById('captureContent').value;
    
    await handleQuickCapture(type, title, content);
    
    captureModal.classList.remove('show');
    captureForm.style.display = 'none';
    captureTypeGrid.style.display = 'grid';
    captureForm.reset();
});

async function handleQuickCapture(type, title, content) {
    setSyncStatus('syncing');
    
    try {
        switch(type) {
            case 'task':
                await supabase.from('tasks').insert({
                    user_id: currentUser.id,
                    title,
                    description: content,
                    type: 'quick',
                    status: 'pending'
                });
                break;
                
            case 'note':
            case 'idea':
                await supabase.from('vault_items').insert({
                    user_id: currentUser.id,
                    title,
                    content,
                    type
                });
                break;
                
            case 'goal':
                await supabase.from('goals').insert({
                    user_id: currentUser.id,
                    title,
                    description: content,
                    is_active: false,
                    progress: 0
                });
                break;
                
            case 'experiment':
                await supabase.from('experiments').insert({
                    user_id: currentUser.id,
                    title,
                    hypothesis: content,
                    status: 'active'
                });
                break;
                
            case 'learning':
                await supabase.from('learning_items').insert({
                    user_id: currentUser.id,
                    title,
                    description: content,
                    category: 'book',
                    status: 'in_progress'
                });
                break;
        }
        
        setSyncStatus('synced');
        
        // Refresh current view
        if (currentTab === 'dashboard') loadDashboardData();
        if (currentTab === 'focus') loadFocusData();
        if (currentTab === 'build') loadGoalsData();
        if (currentTab === 'labs') loadLabsData();
        if (currentTab === 'vault') loadVaultData();
        
    } catch (error) {
        setSyncStatus('error');
        console.error('Capture error:', error);
        alert('Error capturing item: ' + error.message);
    }
}

// ============================================
// UNIVERSAL SEARCH
// ============================================

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    await performUniversalSearch(query);
});

async function performUniversalSearch(query) {
    const results = [];
    
    try {
        // Search tasks
        const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(5);
        
        if (tasks) results.push(...tasks.map(t => ({ ...t, resultType: 'task' })));
        
        // Search vault
        const { data: vault } = await supabase
            .from('vault_items')
            .select('*')
            .eq('user_id', currentUser.id)
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .limit(5);
        
        if (vault) results.push(...vault.map(v => ({ ...v, resultType: 'vault' })));
        
        // Search goals
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', currentUser.id)
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(5);
        
        if (goals) results.push(...goals.map(g => ({ ...g, resultType: 'goal' })));
        
        renderSearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="navigateToResult('${result.resultType}', '${result.id}')">
            <div class="search-result-type">${result.resultType}</div>
            <div class="search-result-title">${result.title}</div>
        </div>
    `).join('');
    
    searchResults.style.display = 'block';
}

function navigateToResult(type, id) {
    searchResults.style.display = 'none';
    searchInput.value = '';
    
    switch(type) {
        case 'task':
            switchTab('focus');
            break;
        case 'goal':
            switchTab('build');
            break;
        case 'vault':
            switchTab('vault');
            break;
    }
}

// Click outside to close search results
document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.style.display = 'none';
    }
});

// ============================================
// SYNC STATUS
// ============================================

function setSyncStatus(status) {
    syncStatus = status;
    const syncDot = document.querySelector('.sync-dot');
    const syncText = document.querySelector('.sync-text');
    
    switch(status) {
        case 'synced':
            syncDot.style.background = '#10b981';
            syncText.textContent = 'Synced';
            break;
        case 'syncing':
            syncDot.style.background = '#f59e0b';
            syncText.textContent = 'Syncing...';
            break;
        case 'error':
            syncDot.style.background = '#ef4444';
            syncText.textContent = 'Error';
            break;
    }
}

// ============================================
// DASHBOARD
// ============================================

async function loadDashboardData() {
    try {
        setSyncStatus('syncing');
        
        // Get tasks count
        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*', { count: 'exact' })
            .eq('user_id', currentUser.id);
        
        if (tasksError) throw tasksError;
        
        const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
        const completedToday = tasks?.filter(t => {
            const today = new Date().toDateString();
            return t.completed_at && new Date(t.completed_at).toDateString() === today;
        }).length || 0;
        
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('todayCompleted').textContent = completedToday;
        
        // Get active goal
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('is_active', true)
            .maybeSingle();
        
        document.getElementById('activeGoal').textContent = goals?.title || 'None';
        document.getElementById('goalProgress').textContent = goals ? `${goals.progress}%` : '0%';
        
        // Get experiments
        const { data: experiments } = await supabase
            .from('experiments')
            .select('*', { count: 'exact' })
            .eq('user_id', currentUser.id);
        
        const activeExperiments = experiments?.filter(e => e.status === 'active').length || 0;
        document.getElementById('todayExperiments').textContent = activeExperiments;
        
        // Get vault count
        const { count: vaultCount } = await supabase
            .from('vault_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUser.id);
        
        document.getElementById('vaultItems').textContent = vaultCount || 0;
        
        setSyncStatus('synced');
    } catch (error) {
        setSyncStatus('error');
        console.error('Dashboard load error:', error);
    }
}

// ============================================
// FOCUS MODULE
// ============================================

async function loadFocusData() {
    if (currentFocusTab === 'execute') {
        await loadExecuteMode();
    } else {
        await loadScheduleMode();
    }
}

async function loadExecuteMode() {
    try {
        setSyncStatus('syncing');
        
        // Get tasks in priority order
        const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        
        const taskSourcesHtml = `
            <div class="task-source-card">
                <h4>Quick Tasks (${tasks?.filter(t => t.type === 'quick').length || 0})</h4>
                ${renderTaskSourceTasks(tasks?.filter(t => t.type === 'quick') || [])}
            </div>
        `;
        
        document.getElementById('taskSourcesList').innerHTML = taskSourcesHtml;
        
        // Show current task
        const currentTask = tasks && tasks.length > 0 ? tasks[0] : null;
        if (currentTask) {
            renderCurrentTask(currentTask);
        } else {
            document.getElementById('currentTaskContainer').innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <h3>No tasks to execute</h3>
                    <p>You're all caught up!</p>
                </div>
            `;
        }
        
        setSyncStatus('synced');
    } catch (error) {
        setSyncStatus('error');
        console.error('Execute mode load error:', error);
    }
}

function renderTaskSourceTasks(tasks) {
    if (tasks.length === 0) {
        return '<p class="text-secondary">No tasks</p>';
    }
    
    return tasks.slice(0, 3).map(task => `
        <div class="task-source-item" onclick="focusOnTask('${task.id}')">
            <span>${task.title}</span>
        </div>
    `).join('');
}

function renderCurrentTask(task) {
    document.getElementById('currentTaskContainer').innerHTML = `
        <div class="current-task-card">
            <h2>${task.title}</h2>
            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
            
            <div class="task-actions">
                <button class="btn btn-success" onclick="completeTask('${task.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Complete
                </button>
                <button class="btn btn-secondary" onclick="skipTask('${task.id}')">Skip</button>
            </div>
        </div>
    `;
}

async function completeTask(taskId) {
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('tasks')
            .update({ 
                status: 'completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', taskId);
        
        setSyncStatus('synced');
        loadExecuteMode();
        loadDashboardData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error completing task: ' + error.message);
    }
}

async function skipTask(taskId) {
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('tasks')
            .update({ status: 'skipped' })
            .eq('id', taskId);
        
        setSyncStatus('synced');
        loadExecuteMode();
    } catch (error) {
        setSyncStatus('error');
        alert('Error skipping task: ' + error.message);
    }
}

function focusOnTask(taskId) {
    // Load specific task
    loadExecuteMode();
}

async function loadScheduleMode() {
    // Schedule mode implementation
    document.getElementById('scheduleList').innerHTML = `
        <div class="empty-state">
            <h3>Schedule mode</h3>
            <p>Time blocking coming soon</p>
        </div>
    `;
}

// ============================================
// BUILD MODULE (GOALS)
// ============================================

async function loadGoalsData() {
    try {
        setSyncStatus('syncing');
        
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (!goals || goals.length === 0) {
            document.getElementById('goalsList').style.display = 'none';
            document.getElementById('goalsEmptyState').style.display = 'flex';
        } else {
            document.getElementById('goalsList').style.display = 'block';
            document.getElementById('goalsEmptyState').style.display = 'none';
            renderGoals(goals);
        }
        
        setSyncStatus('synced');
    } catch (error) {
        setSyncStatus('error');
        console.error('Goals load error:', error);
    }
}

function renderGoals(goals) {
    document.getElementById('goalsList').innerHTML = goals.map(goal => `
        <div class="goal-card ${goal.is_active ? 'active' : ''}">
            <div class="goal-header">
                <h3>${goal.title}</h3>
                ${goal.is_active ? '<span class="badge badge-accent">Active</span>' : ''}
            </div>
            ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${goal.progress}%"></div>
            </div>
            <span class="progress-text">${goal.progress}% Complete</span>
            
            <div class="goal-actions">
                ${!goal.is_active ? `<button class="btn btn-sm btn-primary" onclick="setActiveGoal('${goal.id}')">Set Active</button>` : ''}
                <button class="btn btn-sm btn-secondary" onclick="updateGoalProgress('${goal.id}', ${goal.progress})">Update Progress</button>
            </div>
        </div>
    `).join('');
}

async function setActiveGoal(goalId) {
    try {
        setSyncStatus('syncing');
        
        // Deactivate all goals
        await supabase
            .from('goals')
            .update({ is_active: false })
            .eq('user_id', currentUser.id);
        
        // Activate selected goal
        await supabase
            .from('goals')
            .update({ is_active: true })
            .eq('id', goalId);
        
        setSyncStatus('synced');
        loadGoalsData();
        loadDashboardData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error setting active goal: ' + error.message);
    }
}

async function updateGoalProgress(goalId, currentProgress) {
    const newProgress = prompt(`Enter new progress (0-100):`, currentProgress);
    
    if (newProgress === null) return;
    
    const progress = parseInt(newProgress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
        alert('Please enter a number between 0 and 100');
        return;
    }
    
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('goals')
            .update({ progress })
            .eq('id', goalId);
        
        setSyncStatus('synced');
        loadGoalsData();
        loadDashboardData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error updating progress: ' + error.message);
    }
}

document.getElementById('createFirstGoal')?.addEventListener('click', () => {
    const title = prompt('Enter goal title:');
    if (!title) return;
    
    const description = prompt('Enter goal description (optional):');
    
    createGoal(title, description);
});

async function createGoal(title, description = '') {
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('goals')
            .insert({
                user_id: currentUser.id,
                title,
                description,
                is_active: false,
                progress: 0
            });
        
        setSyncStatus('synced');
        loadGoalsData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error creating goal: ' + error.message);
    }
}

// ============================================
// LABS MODULE (EXPERIMENTS)
// ============================================

async function loadLabsData() {
    try {
        setSyncStatus('syncing');
        
        const { data: experiments } = await supabase
            .from('experiments')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        const totalFailures = experiments?.filter(e => e.status === 'failed').length || 0;
        const totalSuccesses = experiments?.filter(e => e.status === 'success').length || 0;
        const velocity = experiments?.length || 0;
        
        document.getElementById('totalFailures').textContent = totalFailures;
        document.getElementById('totalSuccesses').textContent = totalSuccesses;
        document.getElementById('learningVelocity').textContent = velocity;
        
        const activeExperiments = experiments?.filter(e => e.status === 'active') || [];
        renderExperiments(activeExperiments);
        
        setSyncStatus('synced');
    } catch (error) {
        setSyncStatus('error');
        console.error('Labs load error:', error);
    }
}

function renderExperiments(experiments) {
    if (experiments.length === 0) {
        document.getElementById('experimentsList').innerHTML = `
            <div class="empty-state">
                <h3>No active experiments</h3>
                <p>Create an experiment to start testing</p>
            </div>
        `;
        return;
    }
    
    document.getElementById('experimentsList').innerHTML = experiments.map(exp => `
        <div class="experiment-card">
            <h4>${exp.title}</h4>
            ${exp.hypothesis ? `<p class="experiment-hypothesis">${exp.hypothesis}</p>` : ''}
            
            <div class="experiment-actions">
                <button class="btn btn-sm btn-success" onclick="markExperiment('${exp.id}', 'success')">Success</button>
                <button class="btn btn-sm btn-danger" onclick="markExperiment('${exp.id}', 'failed')">Failed</button>
            </div>
        </div>
    `).join('');
}

async function markExperiment(experimentId, status) {
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('experiments')
            .update({ status })
            .eq('id', experimentId);
        
        setSyncStatus('synced');
        loadLabsData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error updating experiment: ' + error.message);
    }
}

document.getElementById('newExperimentBtn')?.addEventListener('click', () => {
    const title = prompt('Experiment title:');
    if (!title) return;
    
    const hypothesis = prompt('Hypothesis (optional):');
    
    createExperiment(title, hypothesis);
});

async function createExperiment(title, hypothesis = '') {
    try {
        setSyncStatus('syncing');
        
        await supabase
            .from('experiments')
            .insert({
                user_id: currentUser.id,
                title,
                hypothesis,
                status: 'active'
            });
        
        setSyncStatus('synced');
        loadLabsData();
    } catch (error) {
        setSyncStatus('error');
        alert('Error creating experiment: ' + error.message);
    }
}

// ============================================
// VAULT MODULE
// ============================================

async function loadVaultData() {
    try {
        setSyncStatus('syncing');
        
        let query = supabase
            .from('vault_items')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (currentVaultFilter !== 'all') {
            query = query.eq('type', currentVaultFilter);
        }
        
        const { data: vaultItems } = await query;
        
        if (!vaultItems || vaultItems.length === 0) {
            document.getElementById('vaultList').style.display = 'none';
            document.getElementById('vaultEmptyState').style.display = 'flex';
        } else {
            document.getElementById('vaultList').style.display = 'grid';
            document.getElementById('vaultEmptyState').style.display = 'none';
            renderVaultItems(vaultItems);
        }
        
        setSyncStatus('synced');
    } catch (error) {
        setSyncStatus('error');
        console.error('Vault load error:', error);
    }
}

function renderVaultItems(items) {
    document.getElementById('vaultList').innerHTML = items.map(item => `
        <div class="vault-item">
            <div class="vault-item-header">
                <span class="vault-item-type">${item.type}</span>
            </div>
            <h4>${item.title}</h4>
            ${item.content ? `<p class="vault-item-content">${item.content.substring(0, 150)}${item.content.length > 150 ? '...' : ''}</p>` : ''}
            <span class="vault-item-date">${new Date(item.created_at).toLocaleDateString()}</span>
        </div>
    `).join('');
}

document.querySelectorAll('.vault-filter').forEach(filter => {
    filter.addEventListener('click', (e) => {
        currentVaultFilter = e.target.dataset.filter;
        
        document.querySelectorAll('.vault-filter').forEach(f => f.classList.remove('active'));
        e.target.classList.add('active');
        
        loadVaultData();
    });
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            showApp();
            loadDashboardData();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            showAuth();
        }
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString();
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

console.log('O2 Elite v2.0 - Initialized');
