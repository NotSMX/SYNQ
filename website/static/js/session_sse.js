(function() {
    var sessionHash = window.squadScheduleHash;
    if (!sessionHash) return;

    var lastHash = null;
    var pollInterval = 3000;
    var timer = null;

    function poll() {
        fetch('/session/' + sessionHash + '/state')
            .then(function(r) {
                if (!r.ok) throw new Error('bad response');
                return r.json();
            })
            .then(function(data) {
                if (data.state_hash !== lastHash) {
                    lastHash = data.state_hash;
                    handleStateUpdate(data);
                }
            })
            .catch(function() {})
            .finally(function() {
                timer = setTimeout(poll, pollInterval);
            });
    }

    function handleStateUpdate(data) {
        if (typeof window.rebuildCalendar === 'function') {
            window.rebuildCalendar(data.availability);
        }
        updateParticipants(data.participants);
        updateGameTally(data.game_tally);
        updateFinalTime(data.final_time);
        updateChosenGame(data.chosen_game);
        updateConfirmations(data.confirmations);
    }

    function updateParticipants(participants) {
        if (!participants) return;
        var list = document.getElementById('squad-list');
        if (!list) return;
        participants.forEach(function(name) {
            if (!list.querySelector('[data-name="' + CSS.escape(name) + '"]')) {
                var card = document.createElement('div');
                card.className = 'squad-card';
                card.setAttribute('data-name', name);
                var pill = document.createElement('div');
                pill.className = 'squad-pill';
                pill.textContent = name;
                card.appendChild(pill);
                list.appendChild(card);
            }
        });
    }

    function updateGameTally(tally) {
        if (!tally) return;
        var container = document.getElementById('game-tally');
        if (!container) return;
        var noVotes = document.getElementById('no-votes-msg');

        if (tally.length === 0) {
            if (noVotes) noVotes.style.display = '';
            container.querySelectorAll('.vote-card').forEach(function(el) { el.remove(); });
            return;
        }
        if (noVotes) noVotes.style.display = 'none';

        var existing = {};
        container.querySelectorAll('.vote-card').forEach(function(el) {
            existing[el.dataset.game] = el;
        });

        tally.forEach(function(item) {
            var key = item.name;
            if (existing[key]) {
                var countEl = existing[key].querySelector('.vote-count');
                if (countEl) countEl.textContent = item.count;
                delete existing[key];
            } else {
                var card = document.createElement('div');
                card.className = 'vote-card';
                card.dataset.game = key;
                card.innerHTML = '<span class="vote-name">' + key + '</span>' +
                    ' <span class="vote-count">' + item.count + '</span>';
                container.appendChild(card);
            }
        });

        Object.values(existing).forEach(function(el) { el.remove(); });
    }

    function updateFinalTime(finalTime) {
        var marker = document.getElementById('final-time-marker');
        if (!marker) return;
        var current = marker.dataset.finalTime || '';
        var incoming = finalTime || '';
        if (incoming !== current) {
            marker.dataset.finalTime = incoming;
            location.reload();
        }
    }

    function updateChosenGame(chosenGame) {
        var marker = document.getElementById('chosen-game-marker');
        if (!marker) return;
        var current = marker.dataset.chosenGameName || '';
        var incoming = chosenGame || '';
        if (incoming !== current) {
            marker.dataset.chosenGameName = incoming;
            location.reload();
        }
    }

    function updateConfirmations(confirmations) {
        if (!confirmations) return;
        Object.keys(confirmations).forEach(function(name) {
            var status = confirmations[name];
            var el = document.querySelector('[data-confirm-name="' + CSS.escape(name) + '"]');
            if (el) el.dataset.confirmStatus = status;
        });
    }

    // Start polling
    timer = setTimeout(poll, 500); // first poll quickly
})();